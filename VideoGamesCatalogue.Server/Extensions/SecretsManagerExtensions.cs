using Amazon.SecretsManager;
using Amazon.SecretsManager.Model;
using System.Text.Json;

namespace VideoGamesCatalogue.Server.Extensions;

public static class SecretsManagerExtensions
{
    public static void AddAwsSecretsManager(this WebApplicationBuilder builder)
    {
        var secretName = builder.Configuration["AWS:SecretName"]
            ?? throw new InvalidOperationException("AWS:SecretName is not configured in appsettings.");

        using var client = new AmazonSecretsManagerClient();

        var response = client.GetSecretValueAsync(new GetSecretValueRequest
        {
            SecretId = secretName
        }).GetAwaiter().GetResult();

        var secrets = JsonSerializer.Deserialize<Dictionary<string, string>>(response.SecretString)
            ?? throw new InvalidOperationException($"Secret '{secretName}' is empty or not valid JSON.");

        builder.Configuration.AddInMemoryCollection(secrets!);
    }
}
