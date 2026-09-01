namespace MovieTracker.Api.Services;

public interface ICurrentUserService
{
    Guid GetCurrentUserId();
}

// Temporary
public class TemporaryCurrentUserService : ICurrentUserService
{
    private static readonly Guid LocalUserId =
        Guid.Parse("11111111-1111-1111-1111-111111111111");

    public Guid GetCurrentUserId() => LocalUserId;
}