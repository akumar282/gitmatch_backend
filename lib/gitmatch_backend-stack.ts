import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import {getAppSyncKey, getAppSyncUrl} from './src/utils/utils'


export class GitmatchBackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const projectMatchingLambda = new lambda.Function(this, 'ProjectMatchingLambda', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      code: lambda.Code.fromAsset('lib/src/lambda'),
      handler: 'projectMatchingHandler.handler',
      environment: {
        APPSYNC_URL: getAppSyncUrl(),
        APPSYNC_KEY: getAppSyncKey()
      }
    })

    const matchNumberLambda = new lambda.Function(this, 'MatchNumberLambda', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      code: lambda.Code.fromAsset('lib/src/lambda'),
      handler: 'matchNumberHandler.handler'
    })

    const matchNumberTable = new dynamodb.Table(this, 'matchNumberTable', {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      sortKey: {name: 'createdAt', type: dynamodb.AttributeType.NUMBER},
      pointInTimeRecovery: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN_ON_UPDATE_OR_DELETE
    })

    matchNumberTable.addLocalSecondaryIndex({
      indexName: 'userIdIndex',
      sortKey: {
        name: 'userId',
        type: dynamodb.AttributeType.STRING
      }
    })

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

    const resource = matchNumberAPI.root.addResource('user').addResource('{userId}')
    resource.addMethod('GET', getMatchNumberIntegration)
    resource.addMethod('POST', getMatchNumberIntegration)
    resource.addMethod('PATCH', getMatchNumberIntegration)
  }
}
