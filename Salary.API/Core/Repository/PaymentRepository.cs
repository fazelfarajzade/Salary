using Dapper.Contrib.Extensions;
using Salary.API.Core.Entities;
using Salary.API.Core.Repository.Interfaces;

namespace Salary.API.Core.Repository
{
    public class PaymentRepository : IPaymentRepository
    {
        private readonly DapperContext _context;
        public PaymentRepository(DapperContext context)
        {
            _context = context;
        }

        public async Task<Payment?> GetPayment(int id)
        {
            using (var connection = _context.CreateConnection())
            {
                var payment = await connection.GetAsync<Payment>(id);
                return payment;
            }
        }

        public async Task<IEnumerable<Payment>> GetPayments()
        {
            //var query = "SELECT * FROM Payments";
            using (var connection = _context.CreateConnection())
            {
                var payments = await connection.GetAllAsync<Payment>();
                return payments.ToList();
            }
        }
        public async Task<int> InsertPayment(Payment payment)
        {
            //var query = "SELECT * FROM Salaries";
            using (var connection = _context.CreateConnection())
            {
                var paymentId = await connection.InsertAsync<Payment>(payment);
                return paymentId;
            }
        }
        public async Task<bool> DeletePayment(int Id)
        {
            var payment = new Payment() { PaymentId = Id };
            using (var connection = _context.CreateConnection())
            {
                var deleted = await connection.DeleteAsync<Payment>(payment);
                return deleted;
            }
        }
    }
}
