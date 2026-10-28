pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    environment {
        CI = 'true'
    }

    stages {
        stage('Checkout Source') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                // Installs only Chromium and Firefox plus OS-level system dependencies
                sh 'npx playwright install --with-deps chromium firefox'
            }
        }

        stage('Run Tests') {
            steps {
                // Runs parallel cross-browser tests against Chromium and Firefox
                sh 'npm test'
            }
        }
    }

    post {
        always {
            // Generate and publish the Allure report dashboard on Jenkins
            allure([
                includeProperties: false,
                jdk: '',
                properties: [],
                reportBuildPolicy: 'ALWAYS',
                results: [[path: 'allure-results']]
            ])
        }
        failure {
            // Archive screenshots, traces, and video artifacts on test failure
            archiveArtifacts artifacts: 'test-results/**', allowEmptyArchive: true
        }
    }
}