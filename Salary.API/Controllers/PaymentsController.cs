using Microsoft.AspNetCore.Mvc;
using Salary.API.Core.Entities;
using Salary.API.Core.Repository.Interfaces;

namespace Salary.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly IPaymentRepository _paymentRepo;
        public PaymentsController(IPaymentRepository paymentRepo)
        {
            _paymentRepo = paymentRepo;
        }
        [HttpGet]
        public async Task<IActionResult> GetPayments()
        {
            try
            {
                var payments = await _paymentRepo.GetPayments();
                return Ok(payments);
            }
            catch (Exception ex)
            {
                //log error
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPayment(int id)
        {
            try
            {
                var payments = await _paymentRepo.GetPayment(id);
                return Ok(payments);
            }
            catch (Exception ex)
            {
                //log error
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] Payment payment)
        {
            try
            {
                payment.PaymentDateTime = DateTime.Now;
                var paymentId = await _paymentRepo.InsertPayment(payment);
                return Ok(paymentId);
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
                var deleted = await _paymentRepo.DeletePayment(id);
                if (deleted)
                    return Ok();
                else
                    return BadRequest("تغییری در اطلاعات ثبتی داده نشد.");
            }
            catch (Exception ex)
            {
                //log error
                return BadRequest(ex.Message);
            }
        }
    }
}
