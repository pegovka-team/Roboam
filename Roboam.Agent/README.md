# Roboam.Agent

## Features

* Special program for worker execution
* Fetch changes in worker's source code repository
* Restart worker using prepared script `runworker.sh` when commit with message like "#restart arg1 arg2 arg3..." is fetched and use given arguments to start worker

## Usage

### Ensure you have
1. Git and bash installed
2. Access to repository
3. Needed dependencies installed to build worker: libraries, programming languages and etc.
4. Secrets and credentials for API, database and etc. accessed during worker execution
5. `runworker.sh` script in repository root to build and launch worker

### Build and start agent using command

`agent <repoUrl> <repoDirectory> <repoBranch> [repoUpdateInterval]`

* `repoUrl` – SSH URL of worker source code repository used for git cloning e.g. `git@github.com:pegovka-team/Roboam.git`
* `repoDirectory` – Desirable directory of worker source code
* `repoBranch` – Branch to track
* `repoUpdateInterval` – Interval in milliseconds between repository fetching, default is 5000ms

