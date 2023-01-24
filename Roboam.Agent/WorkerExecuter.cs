using System;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using CliWrap;

namespace agent
{
    public class WorkerExecuter
    {
        public WorkerExecuter(RunWorkerCommands commands)
        {
            RunCommands = commands;
            cancelCts.Token.Register(() => killCts.CancelAfter(TimeSpan.FromSeconds(5)));
        }

        public WorkerExecuter()
        {
            RunCommands = new RunWorkerCommands();
        }

        public async void Execute(string extraCommitArgs)
        {
            foreach (var runCommand in RunCommands.Commands)
            {
                var args = runCommand.Args;
                if (runCommand.WithArgsFromCommit && extraCommitArgs.Length > 0)
                {
                    args += $" {extraCommitArgs}";
                }
                Console.WriteLine($"Executing {runCommand.Executable} with args {args}");

                var stderrBuilder = new StringBuilder();
                
                // TODO: починить команды с выводом в stdout (падают с broken pipe)
                // TOOD: обработать ошибки запуска процесса
                workerCommandExecution = Cli.Wrap(runCommand.Executable)
                    .WithArguments(args)
                    .WithValidation(CommandResultValidation.None)
                    .WithStandardErrorPipe(PipeTarget.ToStringBuilder(stderrBuilder))
                    .ExecuteAsync(killCts.Token, cancelCts.Token);
                var workerCommandExecutionResult = await workerCommandExecution;
                
                if (workerCommandExecutionResult.ExitCode != 0)
                {
                    Console.WriteLine($"Execution of command {runCommand.Executable} {args} is finished with non-zero code:" +
                                      $"{stderrBuilder}");
                    break;
                }

                Console.WriteLine($"Finished execution of {runCommand.Executable} with args {args}");
                cancelCts.TryReset();
                killCts.TryReset();
            }
        }

        public void InterruptCurrentExecution()
        {
            if (workerCommandExecution is not null)
            {
                cancelCts.Cancel();
                try
                {
                    workerCommandExecution.Wait();
                }
                catch (AggregateException)
                {
                }
            }
        }

        public RunWorkerCommands RunCommands;
        private Task<CommandResult>? workerCommandExecution;
        private readonly CancellationTokenSource killCts = new();
        private readonly CancellationTokenSource cancelCts = new();
    }
}