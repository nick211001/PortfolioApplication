// Wait for the DOM to fully load before executing the script
document.addEventListener("DOMContentLoaded", function () {
  const fcfInputs = document.getElementById("fcfInputs");

  // Create input rows for 10 years of FCF
  for (let i = 1; i <= 10; i++) {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>Year ${i}</td>
            <td><input type="number" class="fcf" id="fcf${i}" step="0.01" required></td>
        `;
    fcfInputs.appendChild(row);
  }
});

// Function to calculate Discounted Cash Flow (DCF)
function calculateDCF() {
  // Array to store FCF values
  let fcfArray = [];
  // Collect FCF values from inputs and validate
  for (let i = 1; i <= 10; i++) {
    const fcf = parseFloat(document.getElementById(`fcf${i}`).value);
    if (isNaN(fcf)) {
      alert(`Please enter a valid number for Year ${i} FCF.`);
      return;
    }
    fcfArray.push(fcf);
  }
  // Get and parse other input values
  const discountRate =
    parseFloat(document.getElementById("discountRate").value) / 100;
  const growthRate =
    parseFloat(document.getElementById("growthRate").value) / 100;
  const marginOfSafety =
    parseFloat(document.getElementById("marginOfSafety").value) / 100;
  const marketValue = parseFloat(document.getElementById("marketValue").value);

  // Check if any input value is invalid
  if (
    isNaN(discountRate) ||
    isNaN(growthRate) ||
    isNaN(marginOfSafety) ||
    isNaN(marketValue)
  ) {
    alert("Please enter valid numbers for all inputs.");
    return;
  }
  // Calculate the DCF value
  let dcfValue = 0;
  for (let i = 0; i < 10; i++) {
    dcfValue += fcfArray[i] / Math.pow(1 + discountRate, i + 1);
  }

  const terminalValue =
    (fcfArray[9] * (1 + growthRate)) / (discountRate - growthRate);
  dcfValue += terminalValue / Math.pow(1 + discountRate, 10);
  // Adjust the DCF value by the margin of safety to get the intrinsic value
  const intrinsicValue = dcfValue * (1 - marginOfSafety);

  // Determine if the company is overvalued or undervalued based on the intrinsic value
  const resultText =
    intrinsicValue > marketValue
      ? `The company is undervalued. Intrinsic Value: $${intrinsicValue.toFixed(
          2
        )}, Market Value: $${marketValue.toFixed(2)}`
      : `The company is overvalued. Intrinsic Value: $${intrinsicValue.toFixed(
          2
        )}, Market Value: $${marketValue.toFixed(2)}`;
  // Display the result
  document.getElementById("result").innerText = resultText;
}
