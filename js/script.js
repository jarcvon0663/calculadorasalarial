function formatNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function formatInputValue(input) {
  var value = input.value.replace(/\./g, "");
  input.value = formatNumber(value);
}

function calculateCost() {
  var salaryInput = document.getElementById("salary");
  var bonusesInput = document.getElementById("bonuses");
  var benefitsInput = document.getElementById("benefits");

  var salary = parseFloat(salaryInput.value.replace(/\./g, ""));
  var bonuses = parseFloat(bonusesInput.value.replace(/\./g, ""));
  var benefits = parseFloat(benefitsInput.value.replace(/\./g, ""));

  var integral = document.getElementById("integral").checked;
  var result = document.getElementById("result");

  var smmlv = 1160000; // Valor del salario mínimo mensual legal vigente
  // calculo del auxilio de transporte
  if (salary < 2 * smmlv) {
    transportAllowance = 140606;
  } else {
    transportAllowance = 0;
  }

  var salud = salary * 0.085;
  var pension = salary * 0.12;

  // Cálculo de fsp
  if (salary > 4 * smmlv) {
    fsp = salary * 0.01;
  } else {
    fsp = 0;
  }

  if (integral && salary <= 15079999) {
    result.innerHTML =
      "El salario debe ser superior a 15079999 para el régimen integral.";
    return;
  }

  var cost;
  if (integral) {
    cost = Math.ceil(salary * 1.27135 + bonuses + benefits); // Cálculo del costo según régimen integral
  } else if (salary < 2 * smmlv) {
    cost = Math.ceil(
      salary * 1.40308 + transportAllowance + 45000 + bonuses + benefits
    ); // Cálculo del costo según escenario 1
  } else if (salary + bonuses < 10 * smmlv) {
    cost = Math.ceil(salary * 1.40308 + bonuses + benefits); // Cálculo del costo según escenario 2
  } else {
    cost = Math.ceil(salary * 1.53808 + bonuses + benefits); // Cálculo del costo según escenario 3
  }

  formatInputValue(salaryInput);
  formatInputValue(bonusesInput);
  formatInputValue(benefitsInput);

  result.innerHTML =
    "El costo total del empleado es: $" + formatNumber(cost) + "<br>" +
    "<br>";
  result.innerHTML +=
    "El pago por salud es: $" + formatNumber(salud.toFixed(0)) + "<br>";
  result.innerHTML +=
    "El pago por pensión es: $" +
    formatNumber(pension.toFixed(0)) +
    "<br>";
  result.innerHTML +=
    "El pago por FSP es: $" +
    formatNumber(fsp.toFixed(0)) +
    "<br>";

  var formattedCost = formatNumber(cost).replace(/\./g, "");
  document.getElementById("amount").value = formattedCost;
  document.getElementById("filtro").value = formattedCost;
}

function calculateNetSalary() {
  var salaryInput = document.getElementById("salary");
  var bonusesInput = document.getElementById("bonuses");
  var daysWorkedInput = document.getElementById("days-worked");
  var salary = parseFloat(salaryInput.value.replace(/\./g, ""));
  var bonuses = parseFloat(bonusesInput.value.replace(/\./g, ""));
  var daysWorked = parseFloat(daysWorkedInput.value);
  var result = document.getElementById("result");

  var smmlv = 1160000; // Valor del salario mínimo mensual legal vigente
  var uvt = 42412; // Valor de la Unidad de Valor Tributario (UVT) en 2023

  // Cálculo del salario neto
  var netSalary = salary;

  // calculo del auxilio de transporte
  if (salary < 2 * smmlv) {
    transportAllowance = 140606;
  } else {
    transportAllowance = 0;
  }

  //calculo de salud
  var salud = salary * 0.04;

  //calculo de pensión
  var pension = salary * 0.04;

  // Cálculo de fsp
  if (salary > 4 * smmlv) {
    fsp = salary * 0.01;
  } else {
    fsp = 0;
  }

  // Descuento del 4% de salud
  netSalary -= salud;

  // Descuento del 4% de pensión
  netSalary -= pension;

  // Verificar si el salario es inferior a 2 smmlv para sumar el auxilio de transporte
  if (salary < 2 * smmlv) {
    netSalary += transportAllowance;
  }

  // Verificar si el salario es superior a 4 smmlv para restar el fondo de solidaridad pensional
  if (salary > 4 * smmlv) {
    netSalary -= fsp;
  }

  // Calcular el salario neto según los días trabajados
  var monthlySalary = netSalary;
  if (daysWorked < 30) {
    monthlySalary = (netSalary / 30) * daysWorked;
  }

  // Sumar las bonificaciones al salario neto
  monthlySalary += bonuses;

  // Cálculo de los ingresos totales
  var ingresoTotal = salary + bonuses + transportAllowance;

  // Cálculo de total descuentos
  var descuentoTotal = salud + pension + fsp;

  // Cifra retención
  var cifraRetencion = ingresoTotal - descuentoTotal;

  // Cálculo de la base gravable en pesos descontando el 25%
  var base = cifraRetencion * 0.75;

  // Cálculo de la base gravable en uvt
  var baseGravable = base / uvt;

  // Cálculo de la retención en la fuente
  var descuento = 0;
  if (baseGravable > 95) {
    if (baseGravable <= 150) {
      descuento = (base - 95 * uvt) * 0.19;
    } else if (baseGravable <= 360) {
      descuento = (base - 150 * uvt) * 0.28 + 10 * uvt;
    } else if (baseGravable <= 640) {
      descuento = (base - 360 * uvt) * 0.33 + 69 * uvt;
    } else if (baseGravable <= 945) {
      descuento = (base - 640 * uvt) * 0.35 + 162 * uvt;
    } else if (baseGravable <= 2300) {
      descuento = (base - 945 * uvt) * 0.37 + 268 * uvt;
    } else {
      descuento = (base - 2300 * uvt) * 0.39 + 770 * uvt;
    }
  }

  result.innerHTML =
    "El salario neto del empleado es: $" +
    formatNumber(monthlySalary) +
    "<br>" +
    "<br>";
  result.innerHTML +=
    "El ingreso total es: $" + formatNumber(ingresoTotal.toFixed(0)) + "<br>";
  result.innerHTML +=
    "El descuento por salud es: $" + formatNumber(salud.toFixed(0)) + "<br>";
  result.innerHTML +=
    "El descuento por pensión es: $" +
    formatNumber(pension.toFixed(0)) +
    "<br>";
  result.innerHTML +=
    "El descuento por FSP es: $" +
    formatNumber(fsp.toFixed(0)) +
    "<br>" +
    "<br>";
  result.innerHTML +=
    "La base gravable para retefuente es: $" +
    formatNumber(base.toFixed(0)) +
    "<br>";
  result.innerHTML +=
    "Posible retención en la fuente sin deducciones no descontada al salario neto es: $" +
    formatNumber(descuento.toFixed(0));

  var formattedNetSalary = formatNumber(monthlySalary).replace(/\./g, "");
  document.getElementById("amount").value = formattedNetSalary;
  document.getElementById("filtro").value = formattedNetSalary;
}

function calculateIntegralSalary() {
  var salaryInput = document.getElementById("salary");
  var bonusesInput = document.getElementById("bonuses");
  var daysWorkedInput = document.getElementById("days-worked");
  var salary = parseFloat(salaryInput.value.replace(/\./g, ""));
  var bonuses = parseFloat(bonusesInput.value.replace(/\./g, ""));
  var daysWorked = parseFloat(daysWorkedInput.value);
  var result = document.getElementById("result");

  var smmlv = 1160000; // Valor del salario mínimo mensual legal vigente
  var uvt = 42412; // Valor de la Unidad de Valor Tributario (UVT) en 2023

  // Cálculo del salario neto
  var netSalaryIntegral = salary;

  // Cálculo 70% del salario integral
  var baseIntegralSalary = salary * 0.7;

  //calculo de salud integral
  var saludIntegral = baseIntegralSalary * 0.04;
  if (daysWorked < 30) {
    saludIntegral = (saludIntegral / 30) * daysWorked;
  }

  //calculo de pensión integral
  var pensionIntegral = baseIntegralSalary * 0.04;
  if (daysWorked < 30) {
    pensionIntegral = (pensionIntegral / 30) * daysWorked;
  }

  // Cálculo de fsp integral
  var fspIntegral = baseIntegralSalary * 0.01;
  if (daysWorked < 30) {
    fspIntegral = (fspIntegral / 30) * daysWorked;
  }

  // Descuento del 4% de salud en el salario integral
  netSalaryIntegral = salary - saludIntegral;

  // Descuento del 4% de pensión en el salario integral
  netSalaryIntegral = salary - pensionIntegral;

  // Descuento del 1% de FSP en el salario integral
  netSalaryIntegral = salary - fspIntegral;

  // Calcular el salario neto según los días trabajados
  var monthlySalaryIntegral = netSalaryIntegral;
  if (daysWorked < 30) {
    monthlySalaryIntegral = (netSalaryIntegral / 30) * daysWorked;
  }

  // Sumar las bonificaciones al salario neto
  monthlySalaryIntegral += bonuses;

  // Cálculo de los ingresos totales
  var ingresoTotalIntegral = salary + bonuses;

  // Cálculo de total descuentos
  var descuentoTotalIntegral = saludIntegral + pensionIntegral + fspIntegral;

  // Cifra retención
  var cifraRetencionIntegral = ingresoTotalIntegral - descuentoTotalIntegral;

  // Cálculo de la base gravable en pesos descontando el 25%
  var baseIntegralRete = cifraRetencionIntegral * 0.75;

  // Cálculo de la base gravable en uvt
  var baseGravableIntegral = baseIntegralRete / uvt;

  // Cálculo de la retención en la fuente
  var descuentoIntegral = 0;
  if (baseGravableIntegral > 95) {
    if (baseGravableIntegral <= 150) {
      descuentoIntegral = (baseIntegralRete - 95 * uvt) * 0.19;
    } else if (baseGravableIntegral <= 360) {
      descuentoIntegral = (baseIntegralRete - 150 * uvt) * 0.28 + 10 * uvt;
    } else if (baseGravableIntegral <= 640) {
      descuentoIntegral = (baseIntegralRete - 360 * uvt) * 0.33 + 69 * uvt;
    } else if (baseGravableIntegral <= 945) {
      descuentoIntegral = (baseIntegralRete - 640 * uvt) * 0.35 + 162 * uvt;
    } else if (baseGravableIntegral <= 2300) {
      descuentoIntegral = (baseIntegralRete - 945 * uvt) * 0.37 + 268 * uvt;
    } else {
      descuentoIntegral = (baseIntegralRete - 2300 * uvt) * 0.39 + 770 * uvt;
    }
  }

  monthlySalaryIntegral -= saludIntegral;
  monthlySalaryIntegral -= pensionIntegral;
  monthlySalaryIntegral -= fspIntegral;
  monthlySalaryIntegral -= descuentoIntegral;

  result.innerHTML =
    "El salario neto integral del empleado es: $" +
    formatNumber(monthlySalaryIntegral) +
    "<br>" +
    "<br>";
  result.innerHTML +=
    "El ingreso total es: $" +
    formatNumber(ingresoTotalIntegral.toFixed(0)) +
    "<br>";
  result.innerHTML +=
    "El descuento por salud es: $" +
    formatNumber(saludIntegral.toFixed(0)) +
    "<br>";
  result.innerHTML +=
    "El descuento por pensión es: $" +
    formatNumber(pensionIntegral.toFixed(0)) +
    "<br>";
  result.innerHTML +=
    "El descuento por FSP es: $" +
    formatNumber(fspIntegral.toFixed(0)) +
    "<br>" +
    "<br>";
  result.innerHTML +=
    "La base gravable para retefuente es: $" +
    formatNumber(baseIntegralRete.toFixed(0)) +
    "<br>";
  result.innerHTML +=
    "Posible retención en la fuente sin deducciones no descontada al salario neto es: $" +
    formatNumber(descuentoIntegral.toFixed(0));

  var formattedNetSalary = formatNumber(monthlySalaryIntegral).replace(
    /\./g,
    ""
  );
  document.getElementById("amount").value = formattedNetSalary;
  document.getElementById("filtro").value = formattedNetSalary;
}

function convertCurrency() {
  var amountInput = document.getElementById("amount");
  var fromCurrencySelect = document.getElementById("fromCurrency");
  var toCurrencySelect = document.getElementById("toCurrency");
  var resultDiv = document.getElementById("conversionResult");

  var amount = parseFloat(amountInput.value);
  var fromCurrency = fromCurrencySelect.value;
  var toCurrency = toCurrencySelect.value;

  // Realiza la llamada a la API de ExchangeRate-API para obtener el tipo de cambio
  // Puedes utilizar la librería fetch o axios para realizar la solicitud HTTP

  // Ejemplo de uso de fetch:
  fetch("https://api.exchangerate-api.com/v4/latest/" + fromCurrency)
    .then((response) => response.json())
    .then((data) => {
      var exchangeRate = data.rates[toCurrency];
      var convertedAmount = amount * exchangeRate;
      var formattedAmount = convertedAmount.toLocaleString("es");
      resultDiv.innerHTML =
        amount.toLocaleString("es") +
        " " +
        fromCurrency +
        " equivale a " +
        formattedAmount +
        " " +
        toCurrency.toFixed(0);
    })
    .catch((error) => {
      resultDiv.innerHTML = "Error al obtener el tipo de cambio";
      console.error(error);
    });
}
