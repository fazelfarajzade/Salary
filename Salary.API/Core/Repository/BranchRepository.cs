using Dapper;
using Dapper.Contrib.Extensions;
using Salary.API.Core.Entities;
using Salary.API.Core.Repository.Interfaces;

namespace Salary.API.Core.Repository
{
    public class BranchRepository: IBranchRepository
    {
        private readonly DapperContext _context;
        public BranchRepository(DapperContext context)
        {
            _context = context;
        }

        public async Task<Branch?> GetBranch(int id)
        {
            using (var connection = _context.CreateConnection())
            {
                var branch = await connection.GetAsync<Branch>(id);
                return branch;
            }
        }

        public async Task<IEnumerable<Branch>> GetBranchs()
        {
            using (var connection = _context.CreateConnection())
            {
                var branchs = await connection.GetAllAsync<Branch>();
                return branchs.ToList();
            }
        }
        public async Task<int> InsertBranch(Branch branch)
        {
            using (var connection = _context.CreateConnection())
            {
                var branchId = await connection.InsertAsync<Branch>(branch);
                return branchId;
            }
        }

        public async Task<bool> UpdateBranch(Branch branch)
        {
            using (var connection = _context.CreateConnection())
            {
                var updated = await connection.UpdateAsync<Branch>(branch);
                return updated;
            }
        }
        public async Task<bool> DeleteBranch(int Id)
        {
            var branch = new Branch() { BranchId = Id };
            using (var connection = _context.CreateConnection())
            {
                var deleted = await connection.DeleteAsync<Branch>(branch);
                return deleted;
            }
        }
        public async Task<List<User>> GetBranchUsers(int branchId)
        {
            var query = "SELECT * FROM Users where BranchId = @branchId";
            using (var connection = _context.CreateConnection())
            {
                var users = await connection.QueryAsync<User>(query, new { branchId });
                return users.ToList();
            }
        }
    }
}
