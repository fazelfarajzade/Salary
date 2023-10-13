using Salary.API.Core.Entities;
using System.Data;

namespace Salary.API.Core.Repository.Interfaces
{
    public interface ICardRepository
    {
        public Task<IEnumerable<Card>> GetCards();
        public Task<Card?> GetCard(int id);
        public Task<int> InsertCard(Card card, IDbTransaction? transaction = null);
        public Task<bool> DeleteCard(int Id);

    }
}
