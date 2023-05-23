using Salary.API.Core.Entities;
using Salary.API.Core.Repository.Interfaces;
using Dapper;
using Dapper.Contrib;
using Dapper.Contrib.Extensions;

namespace Salary.API.Core.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly DapperContext _context;
        public UserRepository(DapperContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<User>> GetUsers()
        {
            using (var connection = _context.CreateConnection())
            {
                var users = await connection.GetAllAsync<User>();
                return users.ToList();
            }
        }

        public async Task<User?> GetUser(int id)
        {
            using (var connection = _context.CreateConnection())
            {
                var user = await connection.GetAsync<User>(id);
                return user;
            }
        }

        public async Task<User?> GetUser(string userName, string password)
        {
            var query = $"SELECT * FROM Users where {nameof(User.UserName)} = @userName and {nameof(User.Password)} = @password";
            using (var connection = _context.CreateConnection())
            {
                var user = await connection.QueryAsync<User>(query, new { userName, password });
                return user.FirstOrDefault();
            }
        }

        public async Task<int> InsertUser(User user)
        {
            using (var connection = _context.CreateConnection())
            {
                var userId = await connection.InsertAsync<User>(user);
                return userId;
            }
        }

        public async Task<bool> UpdateUser(User user)
        {
            using (var connection = _context.CreateConnection())
            {
                var updated = await connection.UpdateAsync<User>(user);
                return updated;
            }
        }
        public async Task<bool> DeleteUser(int Id)
        {
            var user = new User() { UserId = Id };
            using (var connection = _context.CreateConnection())
            {
                var deleted = await connection.DeleteAsync<User>(user);
                return deleted;
            }
        }

        public async Task<IEnumerable<Entities.Salary>> GetUserSalaries(int id, int? year)
        {
            var query = $"SELECT * FROM Salaries where {nameof(User.UserId)} = @id";
            if (year != null)
                query += $" and {nameof(Entities.Salary.YearFrom)} = @year";
            using (var connection = _context.CreateConnection())
            {
                var salaries = await connection.QueryAsync<Entities.Salary>(query, new { id, year });
                return salaries.ToList();
            }
        }
        public async Task<IEnumerable<Loan>> GetUserLoans(int id, int? year)
        {

            var query = $"SELECT * FROM Loans where {nameof(User.UserId)} = @id";
            if (year != null)
            {
                query += $" and {nameof(Loan.PaymentDateTime)} >= @year and {nameof(Loan.PaymentDateTime)} < (@year + 1) ";
            }
            using (var connection = _context.CreateConnection())
            {
                var loans = await connection.QueryAsync<Loan>(query, new { id, year});
                return loans.ToList();
            }
        }
        public async Task<IEnumerable<Payment>> GetUserPayments(int id, int? year)
        {

            var query = $"SELECT * FROM Payments where {nameof(User.UserId)} = @id";
            if (year != null)
            {
                query += $" and {nameof(Payment.PaymentYear)} = @year";
            }
            using (var connection = _context.CreateConnection())
            {
                var payments = await connection.QueryAsync<Payment>(query, new { id, year });
                return payments.ToList();
            }
        }
        public async Task<IEnumerable<Debt>> GetUserDebts(int id, int? year)
        {
            var query = $"SELECT * FROM Debts where {nameof(User.UserId)} = @id";
            if (year != null)
            {
                query += $" and {nameof(Debt.DebtYear)} = @year";
            }
            using (var connection = _context.CreateConnection())
            {
                var debts = await connection.QueryAsync<Debt>(query, new { id, year });
                return debts.ToList();
            }
        }
    }
}
