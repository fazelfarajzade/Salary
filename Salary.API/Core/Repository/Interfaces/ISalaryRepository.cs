namespace Salary.API.Core.Repository.Interfaces
{
    public interface ISalaryRepository
    {
        public Task<IEnumerable<Entities.Salary>> GetSalaries();
        public Task<Entities.Salary?> GetSalary(int id);
        public Task<int> InsertSalary(Core.Entities.Salary salary);
        public Task<bool> UpdateSalary(Core.Entities.Salary salary);
        public Task<bool> DeleteSalary(int Id);

    }
}
