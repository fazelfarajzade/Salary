using Dapper.Contrib.Extensions;
using Salary.API.Core.Entities;
using Salary.API.Core.Repository.Interfaces;
using System.Data;

namespace Salary.API.Core.Repository
{
    public class CardRepository : ICardRepository
    {
        private readonly DapperContext _context;
        public CardRepository(DapperContext context)
        {
            _context = context;
        }

        public async Task<Card?> GetCard(int id)
        {
            using (var connection = _context.CreateConnection())
            {
                var card = await connection.GetAsync<Card>(id);
                return card;
            }
        }

        public async Task<IEnumerable<Card>> GetCards()
        {
            //var query = "SELECT * FROM Cards";
            using (var connection = _context.CreateConnection())
            {
                var cards = await connection.GetAllAsync<Card>();
                return cards.ToList();
            }
        }
        public async Task<int> InsertCard(Card card, IDbTransaction? transaction = null)
        {
            //var query = "SELECT * FROM Salaries";
            using (var connection = _context.CreateConnection())
            {
                var cardId = await connection.InsertAsync<Card>(card, transaction);
                return cardId;
            }
        }
        public async Task<bool> DeleteCard(int Id)
        {
            var card = new Card() { CardId = Id };
            using (var connection = _context.CreateConnection())
            {
                var deleted = await connection.DeleteAsync<Card>(card);
                return deleted;
            }
        }
    }
}
