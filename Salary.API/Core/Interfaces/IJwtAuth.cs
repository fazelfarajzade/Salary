using Salary.API.Core.Entities;

namespace Salary.API.Core.Interfaces
{
    public interface IJwtAuth
    {
        string? Authentication(User user, DateTime ExpireDateTime);
    }
}
