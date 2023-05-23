using Salary.API.Core.Entities;

namespace Salary.API.Core.Repository.Interfaces
{
    public interface ILoanRepository
    {
        public Task<IEnumerable<Loan>> GetLoans();
        public Task<Loan?> GetLoan(int id);
        public Task<int> InsertLoan(Loan loan, IEnumerable<Debt> installments);
        public Task<bool> DeleteLoan(int Id);

    }
}
