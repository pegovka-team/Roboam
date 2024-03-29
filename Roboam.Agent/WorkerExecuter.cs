using System;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using CliWrap;

namespace agent
{
    public class WorkerExecuter
    {
        public WorkerExecuter(string repoDirectory)
        {
            this.repoDirectory = repoDirectory;
            cancelCts.Token.Register(() => killCts.CancelAfter(TimeSpan.FromSeconds(5)));
        }

        public WorkerExecuter()
        {
            repoDirectory = "";
            cancelCts.Token.Register(() => killCts.CancelAfter(TimeSpan.FromSeconds(5)));
        }

        public async void Execute(string args)
        {
            Console.WriteLine($"Executing runworker.sh {args}");

            var stdoutBuilder = new StringBuilder();
            var stderrBuilder = new StringBuilder();

            try
            {
                workerCommandExecution = Cli.Wrap("bash")
                    .WithArguments("runworker.sh" + " " + args)
                    .WithWorkingDirectory(repoDirectory)
                    .WithValidation(CommandResultValidation.None)
                    .WithStandardOutputPipe(PipeTarget.ToStringBuilder(stdoutBuilder))
                    .WithStandardErrorPipe(PipeTarget.ToStringBuilder(stderrBuilder))
                    .ExecuteAsync(killCts.Token, cancelCts.Token);
            }
            catch (System.ComponentModel.Win32Exception e)
            {
                Console.WriteLine($"Failed to runworker.sh with args {args}:\n" +
                                  $"{e.Message}\n" +
                                  "Stopped worker execution");
                return;
            }

            CommandResult workerCommandExecutionResult = new(0,new DateTimeOffset(), new DateTimeOffset());
            try
            {
                workerCommandExecutionResult = await workerCommandExecution;
            }
            catch (OperationCanceledException)
            {
                return;
            }

            if (workerCommandExecutionResult.ExitCode != 0 && workerCommandExecutionResult.ExitCode != 130)
            {
                Console.WriteLine($"Execution of runworker.sh {args} is finished with non-zero code:\n" +
                                  $"{stderrBuilder}\n" +
                                   "Stopped worker execution");
                return;
            }

            Console.WriteLine($"Finished execution of runworker.sh with args {args}");
            Console.WriteLine(stdoutBuilder);
            cancelCts.TryReset();
            killCts.TryReset();
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

        private readonly string repoDirectory;
        private Task<CommandResult>? workerCommandExecution;
        private readonly CancellationTokenSource killCts = new();
        private readonly CancellationTokenSource cancelCts = new();
    }
}