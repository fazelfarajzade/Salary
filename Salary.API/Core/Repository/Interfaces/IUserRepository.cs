using Salary.API.Core.Entities;

namespace Salary.API.Core.Repository.Interfaces
{
    public interface IUserRepository
    {
        public Task<IEnumerable<User>> GetUsers();
        public Task<User?> GetUser(int id);
        public Task<User?> GetUser(string userName, string password);
        public Task<int> InsertUser(User user);
        public Task<bool> UpdateUser(User user);
        public Task<bool> DeleteUser(int Id);
        public Task<IEnumerable<Core.Entities.Salary>> GetUserSalaries(int id, int? year);
        public Task<IEnumerable<Loan>> GetUserLoans(int id, int? year);
        public Task<IEnumerable<Payment>> GetUserPayments(int id, int? year);
        public Task<IEnumerable<Debt>> GetUserDebts(int id, int? year);
    }
}
