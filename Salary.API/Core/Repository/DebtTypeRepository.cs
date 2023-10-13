using Dapper.Contrib.Extensions;
using Salary.API.Core.Entities;
using Salary.API.Core.Repository.Interfaces;

namespace Salary.API.Core.Repository
{
    public class DebtTypeRepository: IDebtTypeRepository
    {
        private readonly DapperContext _context;
        public DebtTypeRepository(DapperContext context)
        {
            _context = context;
        }

        public async Task<DebtType?> GetDebtType(int id)
        {
            using (var connection = _context.CreateConnection())
            {
                var debtType = await connection.GetAsync<DebtType>(id);
                return debtType;
            }
        }

        public async Task<IEnumerable<DebtType>> GetDebtTypes()
        {
            using (var connection = _context.CreateConnection())
            {
                var DebtTypes = await connection.GetAllAsync<DebtType>();
                return DebtTypes.ToList();
            }
        }
    }
}
