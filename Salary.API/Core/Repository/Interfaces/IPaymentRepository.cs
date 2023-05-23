using Salary.API.Core.Entities;

namespace Salary.API.Core.Repository.Interfaces
{
    public interface IPaymentRepository
    {
        public Task<IEnumerable<Payment>> GetPayments();
        public Task<Payment?> GetPayment(int id);
        public Task<int> InsertPayment(Payment payment);
        public Task<bool> DeletePayment(int Id);

    }
}
