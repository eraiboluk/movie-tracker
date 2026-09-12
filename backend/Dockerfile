FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["MovieTracker.Api/MovieTracker.Api.csproj", "MovieTracker.Api/"]
RUN dotnet restore "MovieTracker.Api/MovieTracker.Api.csproj"
COPY . .
WORKDIR "/src/MovieTracker.Api"
RUN dotnet build "MovieTracker.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "MovieTracker.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
EXPOSE 8080
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "MovieTracker.Api.dll"]
