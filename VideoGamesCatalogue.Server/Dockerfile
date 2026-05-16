FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
USER app
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["VideoGamesCatalogue.Server/VideoGamesCatalogue.Server.csproj", "VideoGamesCatalogue.Server/"]
RUN dotnet restore "./VideoGamesCatalogue.Server/VideoGamesCatalogue.Server.csproj"
COPY . .
WORKDIR "/src/VideoGamesCatalogue.Server"
RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /https-cert \
    && openssl req -x509 -newkey rsa:4096 -keyout /https-cert/key.pem -out /https-cert/cert.pem -days 365 -nodes \
        -subj "/C=US/ST=State/L=City/O=VideoGamesCatalogue/CN=localhost" \
        -addext "subjectAltName=DNS:localhost,IP:127.0.0.1" \
    && openssl pkcs12 -export -out /https-cert/https-dev-cert.pfx -inkey /https-cert/key.pem -in /https-cert/cert.pem -passout pass:Password123!
RUN dotnet build "./VideoGamesCatalogue.Server.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./VideoGamesCatalogue.Server.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
USER root
COPY --from=publish /app/publish .
COPY --from=build /https-cert/https-dev-cert.pfx /https-dev-cert.pfx
RUN chmod 644 /https-dev-cert.pfx && chown app:app /https-dev-cert.pfx
USER app
ENTRYPOINT ["dotnet", "VideoGamesCatalogue.Server.dll"]