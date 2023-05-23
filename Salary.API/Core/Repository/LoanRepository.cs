using Salary.API.Core.Entities;
using Salary.API.Core.Repository.Interfaces;
using Dapper;
using Dapper.Contrib;
using Dapper.Contrib.Extensions;
using System.Diagnostics;

namespace Salary.API.Core.Repository
{
    public class LoanRepository : ILoanRepository
    {
        private readonly DapperContext _context;
        private readonly IDebtRepository _debtRepo;

        public LoanRepository(DapperContext context, IDebtRepository debtRepo)
        {
            _context = context;
            this._debtRepo = debtRepo;
        }

        public async Task<Loan?> GetLoan(int id)
        {
            using (var connection = _context.CreateConnection())
            {
                var loan = await connection.GetAsync<Loan>(id);
                return loan;
            }
        }

        public async Task<IEnumerable<Loan>> GetLoans()
        {
            //var query = "SELECT * FROM Loans";
            using (var connection = _context.CreateConnection())
            {
                var loans = await connection.GetAllAsync<Loan>();
                return loans.ToList();
            }
        }
        public async Task<int> InsertLoan(Loan loan, IEnumerable<Debt> installments)
        {
            //var query = "SELECT * FROM Salaries";
            var loanId = 0;
            using (var connection = _context.CreateConnection())
            {
                //var loanId = await connection.InsertAsync<Loan>(loan);
                //return loanId;
                
                using (var transaction = connection.BeginTransaction())
                {
                    try
                    {
                        // Insert the loan record
                        loanId = await connection.InsertAsync<Loan>(loan, transaction);

                        // Insert the debt records
                        foreach (var installment in installments)
                        {
                            await _debtRepo.InsertDebt(installment);   
                        }

                        // Commit the transaction
                        transaction.Commit();
                    }
                    catch (Exception ex)
                    {
                        // Handle any exceptions and roll back the transaction if necessary
                        transaction.Rollback();
                        throw new Exception(ex.Message);
                    }
                }
            }

            return loanId;
        }
        public async Task<bool> DeleteLoan(int Id)
        {
            var loan = new Loan() { LoanId = Id };
            using (var connection = _context.CreateConnection())
            {
                var deleted = await connection.DeleteAsync<Loan>(loan);
                return deleted;
            }
        }
    }
}
