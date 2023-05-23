using Salary.API.Core.Entities;
using Salary.API.Core.Repository.Interfaces;
using Dapper.Contrib.Extensions;
using System.Data;

namespace Salary.API.Core.Repository
{
    public class DebtRepository : IDebtRepository
    {
        private readonly DapperContext _context;
        public DebtRepository(DapperContext context)
        {
            _context = context;
        }

        public async Task<Debt?> GetDebt(int id)
        {
            using (var connection = _context.CreateConnection())
            {
                var debt = await connection.GetAsync<Debt>(id);
                return debt;
            }
        }

        public async Task<IEnumerable<Debt>> GetDebts()
        {
            //var query = "SELECT * FROM Debts";
            using (var connection = _context.CreateConnection())
            {
                var debts = await connection.GetAllAsync<Debt>();
                return debts.ToList();
            }
        }
        public async Task<int> InsertDebt(Debt debt, IDbTransaction transaction = null)
        {
            //var query = "SELECT * FROM Salaries";
            using (var connection = _context.CreateConnection())
            {
                var debtId = await connection.InsertAsync<Debt>(debt, transaction);
                return debtId;
            }
        }
        public async Task<bool> DeleteDebt(int Id)
        {
            var debt = new Debt() { DebtId = Id };
            using (var connection = _context.CreateConnection())
            {
                var deleted = await connection.DeleteAsync<Debt>(debt);
                return deleted;
            }
        }
    }
}
