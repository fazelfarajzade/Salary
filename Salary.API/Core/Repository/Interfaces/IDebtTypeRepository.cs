using Salary.API.Core.Entities;

namespace Salary.API.Core.Repository.Interfaces
{
    public interface IDebtTypeRepository
    {
        public Task<IEnumerable<DebtType>> GetDebtTypes();
        public Task<DebtType?> GetDebtType(int id);

    }
}
