using Salary.API.Core.Entities;
using System.Data;

namespace Salary.API.Core.Repository.Interfaces
{
    public interface IDebtRepository
    {
        public Task<IEnumerable<Debt>> GetDebts();
        public Task<Debt?> GetDebt(int id);
        public Task<int> InsertDebt(Debt payment, IDbTransaction transaction = null);
        public Task<bool> DeleteDebt(int Id);

    }
}
