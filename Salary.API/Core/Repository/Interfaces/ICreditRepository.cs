using Salary.API.Core.Entities;
using System.Data;

namespace Salary.API.Core.Repository.Interfaces
{
    public interface ICreditRepository
    {
        public Task<IEnumerable<Credit>> GetCredits();
        public Task<Credit?> GetCredit(int id);
        public Task<int> InsertCredit(Credit credit, IDbTransaction transaction = null);
        public Task<bool> DeleteCredit(int Id);

    }
}
