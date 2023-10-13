using Dapper;
using Dapper.Contrib.Extensions;
using Salary.API.Core.Entities;
using Salary.API.Core.Repository.Interfaces;

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
            var loanId = 0;
            using (var connection = _context.CreateConnection())
            {
                //var loanId = await connection.InsertAsync<Loan>(loan);
                //return loanId;
                connection.Open();
                using (var transaction = connection.BeginTransaction())
                {
                    try
                    {
                        // Insert the loan record
                        loanId = await connection.InsertAsync<Loan>(loan, transaction);

                        // Insert the debt records
                        foreach (var installment in installments)
                        {
                            installment.DebtReferenceId = loanId;
                            await _debtRepo.InsertDebt(installment);   
                        }

                        // Commit the transaction
                        transaction.Commit();
                        connection.Close();
                    }
                    catch (Exception ex)
                    {
                        // Handle any exceptions and roll back the transaction if necessary
                        transaction.Rollback();
                        connection.Close();
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
                connection.Open();
                using (var transaction = connection.BeginTransaction())
                {
                    try
                    {
                        var sql = $"DELETE FROM Debts WHERE {nameof(Debt.DebtReferenceType)} = {(int)Debt.DebtReferenceTypes.LOAN} and {nameof(Debt.DebtReferenceId)} = @Id";
                        await connection.ExecuteAsync(sql, new { Id }, transaction);
                        await connection.DeleteAsync<Loan>(loan, transaction);
                        // Commit the transaction
                        transaction.Commit();
                        connection.Close();
                    }
                    catch (Exception ex)
                    {
                        // Handle any exceptions and roll back the transaction if necessary
                        transaction.Rollback();
                        connection.Close();
                        throw new Exception(ex.Message);
                    }
                }
            }
            return true;
        }
    }
}
