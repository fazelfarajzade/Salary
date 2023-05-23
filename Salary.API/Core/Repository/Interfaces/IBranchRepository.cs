using Salary.API.Core.Entities;

namespace Salary.API.Core.Repository.Interfaces
{
    public interface IBranchRepository
    {
        public Task<IEnumerable<Branch>> GetBranchs();
        public Task<Branch?> GetBranch(int id);
        public Task<int> InsertBranch(Core.Entities.Branch branch);
        public Task<bool> UpdateBranch(Core.Entities.Branch branch);
        public Task<bool> DeleteBranch(int Id);
        public Task<List<User>> GetBranchUsers(int BranchId);

    }
}
