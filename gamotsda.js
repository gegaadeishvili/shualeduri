const fs = require("fs");
const path = require("path");
const jsonfile = require("jsonfile");
const { program } = require("commander");

const dataFilePath = path.join(__dirname, "expenses.json");
program.version("0.1.0").description("CLI-приложение для управления расходами");

program
  .command("create-expense <total> <category> <date>")
  .description("Добавить объект расходов")
  .action((total, category, date) => {
    const newExpense = {
      id: Date.now(),
      total,
      category,
      date,
    };

    const expenses = readDataFile();
    expenses.push(newExpense);

    writeDataFile(expenses);

    console.log(`expense with ID: ${newExpense.id} success created.`);
  });

program
  .command("delete-expense")
  .description("Delete expense")
  .option("-id, --expense-id <id>", "ID expese for delete")
  .action((options) => {
    const { expenseId } = options;

    if (!expenseId) {
      console.error("Ples=ase, write expense ID, use: --expense-id");
      process.exit(1);
    }

    const expenses = readDataFile();
    const index = expenses.findIndex((expense) => expense.id == expenseId);

    if (index !== -1) {
      expenses.splice(index, 1);
      writeDataFile(expenses);
      console.log(`Expense  ID: ${expenseId} : has been delete.`);
    } else {
      console.error(`Expense with ID: ${expenseId} not found.`);
    }
  });

program
  .command("search-expense")
  .description("Serch expense by ID")
  .option("-c, --category <category>", "Category by find")
  .action((options) => {
    const { category } = options;

    if (!category) {
      console.error("Please, write category, use --category");
      process.exit(1);
    }

    const expenses = readDataFile();
    const filteredExpenses = expenses.filter(
      (expense) => expense.category.toLowerCase() === category.toLowerCase()
    );

    console.log("result:");
    filteredExpenses.forEach((expense) => console.log(expense));
  });
program.parse(process.argv);

function readDataFile() {
  try {
    return jsonfile.readFileSync(dataFilePath, { throws: false }) || [];
  } catch (error) {
    return [];
  }
}

function writeDataFile(data) {
  jsonfile.writeFileSync(dataFilePath, data, { spaces: 2 });
}
