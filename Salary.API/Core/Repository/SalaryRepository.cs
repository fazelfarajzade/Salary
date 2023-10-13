using Dapper.Contrib.Extensions;
using Salary.API.Core.Repository.Interfaces;

namespace Salary.API.Core.Repository
{
    public class SalaryRepository : ISalaryRepository
    {
        private readonly DapperContext _context;
        public SalaryRepository(DapperContext context)
        {
            _context = context;
        }

        public async Task<Entities.Salary?> GetSalary(int id)
        {
            using (var connection = _context.CreateConnection())
            {
                var branch = await connection.GetAsync<Entities.Salary>(id);
                return branch;
            }
        }

        public async Task<IEnumerable<Entities.Salary>> GetSalaries()
        {
            //var query = "SELECT * FROM Salaries";
            using (var connection = _context.CreateConnection())
            {
                var salaries = await connection.GetAllAsync<Entities.Salary>();
                return salaries.ToList();
            }
        }

        public async Task<int> InsertSalary(Core.Entities.Salary salary)
        {
            //var query = "SELECT * FROM Salaries";
            using (var connection = _context.CreateConnection())
            {
                var salaryId = await connection.InsertAsync<Entities.Salary>(salary);
                return salaryId;
            }
        }

        public async Task<bool> UpdateSalary(Entities.Salary salary)
        {
            using (var connection = _context.CreateConnection())
            {
                var updated = await connection.UpdateAsync<Entities.Salary>(salary);
                return updated;
            }
        }
        public async Task<bool> DeleteSalary(int Id)
        {
            var salary = new Core.Entities.Salary() { SalaryId = Id };
            using (var connection = _context.CreateConnection())
            {
                var deleted = await connection.DeleteAsync<Entities.Salary>(salary);
                return deleted;
            }
        }
    }
}
