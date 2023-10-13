using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Salary.API.Core.Entities;
using Salary.API.Core.Repository.Interfaces;

namespace Salary.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CardsController : ControllerBase
    {
        private readonly ICardRepository _cardRepo;
        public CardsController(ICardRepository cardRepo)
        {
            _cardRepo = cardRepo;
        }
        [HttpGet]
        public async Task<IActionResult> GetCards()
        {
            try
            {
                var cards = await _cardRepo.GetCards();
                return Ok(cards);
            }
            catch (Exception ex)
            {
                //log error
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCard(int id)
        {
            try
            {
                var cards = await _cardRepo.GetCard(id);
                return Ok(cards);
            }
            catch (Exception ex)
            {
                //log error
                return BadRequest(ex.Message);
            }
        }
        [AllowAnonymous]
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] Card card)
        {
            try
            {
                card.RegDateTime = DateTime.Now;
                var cardId = await _cardRepo.InsertCard(card);
                return Ok(cardId);
            }
            catch (Exception ex)
            {
                //log error
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                var deleted = await _cardRepo.DeleteCard(id);
                if (deleted)
                    return Ok();
                else
                    return BadRequest("هیچ کارتی ای حذف نشد.");
            }
            catch (Exception ex)
            {
                //log error
                return BadRequest(ex.Message);
            }
        }
    }
}
