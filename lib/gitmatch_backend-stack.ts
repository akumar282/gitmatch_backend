import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import {getAccessKeyId, getAppSyncKey, getAppSyncUrl, getSecretKey} from './src/utils/utils'


export class GitmatchBackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const projectMatchingLambda = new lambda.Function(this, 'ProjectMatchingLambda', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      code: lambda.Code.fromAsset('lib/src/lambda'),
      handler: 'projectMatchingHandler.handler',
      environment: {
        APPSYNC_URL: getAppSyncUrl(),
        APPSYNC_KEY: getAppSyncKey(),
        ACCESS_KEY_ID: getAccessKeyId(),
        SECRET_ACCESS_KEY: getSecretKey()
      }
    })

    const matchNumberLambda = new lambda.Function(this, 'MatchNumberLambda', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      code: lambda.Code.fromAsset('lib/src/lambda'),
      handler: 'matchNumberHandler.handler',
      environment: {
        TABLE_NAME: 'matchNumberTable'
      }
    })

    const matchNumberTable = new dynamodb.Table(this, 'matchNumberTable', {
      tableName: 'matchNumberTable',
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      pointInTimeRecovery: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN_ON_UPDATE_OR_DELETE
    })

    matchNumberTable.addGlobalSecondaryIndex({
      indexName: 'userIdIndex',
      partitionKey: {
        name: 'userId',
        type: dynamodb.AttributeType.STRING
      },
      projectionType: dynamodb.ProjectionType.ALL
    })

    matchNumberTable.grantReadWriteData(matchNumberLambda)

    const retrieveMatchesAPI = new apigateway.RestApi(this, 'matches-api', {
      restApiName: 'matchesRetrievalAPI',
      description: 'This api retrieves the project matches for a given user'
    })

    const matchNumberAPI = new apigateway.RestApi(this, 'match-number-api', {
      restApiName: 'matchNumberAPI',
      description: 'This api retrieves the number of times a user has been matched to a project in one day'
    })

    const getMatchesIntegration = new apigateway.LambdaIntegration(
      projectMatchingLambda,
      {
        requestTemplates: {
          'application/json': '{ \'statusCode\': 200 }'
        }
      }
    )

    const getMatchNumberIntegration = new apigateway.LambdaIntegration(
      matchNumberLambda,
      {
        requestTemplates: {
          'application/json': '{ \'statusCode\': 200 }'
        }
      }
    )

    retrieveMatchesAPI.root.addResource('matches').addResource('{userID}').addMethod('GET', getMatchesIntegration)

    const resource = matchNumberAPI.root.addResource('record')
    resource.addMethod('GET', getMatchNumberIntegration,
      {
        requestParameters: {
          'method.request.querystring.userId': false
        }
      }
    )

    resource.addMethod('POST', getMatchNumberIntegration,
      {
        requestParameters: {
          'method.request.querystring.userId': false
        }
      }
    )

    const recordIdResource = resource.addResource('{id}')
    recordIdResource.addMethod('GET', getMatchNumberIntegration)
    recordIdResource.addMethod('POST', getMatchNumberIntegration)
    recordIdResource.addMethod('PATCH', getMatchNumberIntegration)
  }
}
