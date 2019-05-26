const fs = require('fs').promises
const GoogleSpreadsheet = require('google-spreadsheet')
const credentials = require('./credentials.json')

const spreadsheetId = '1ORBstb-n9sqJL0DQP98jrlpD9uCeQUBES3C1fiC_RaM'

const main = async () => {
  const document = new GoogleSpreadsheet(spreadsheetId)

  await new Promise((resolve) => {
    document.useServiceAccountAuth(credentials, resolve)
  })

  const sheets = await new Promise((resolve) => {
    document.getInfo((err, info) => {
      console.log(`Loaded doc: ${info.title} by ${info.author.email}`)
      resolve(info.worksheets)
    })
  })

  await Promise.all(
    sheets.map(async (sheet, index) => {
      console.log(
        `sheet ${index + 1}: ${sheet.title} ${sheet.rowCount}x${
          sheet.colCount
        }`,
      )

      const keys = await new Promise((resolve) => {
        sheet.getCells({ 'max-row': 1 }, (err, cells) => {
          const result = cells.map((cell) => {
            return cell.value
          })
          resolve(result)
        })
      })

      const rows = await new Promise((resolve) => {
        sheet.getRows({}, (err, rows) => {
          const result = rows.map((row) => {
            return keys.reduce((acc, key) => {
              return {
                ...acc,
                [key]: row[key],
              }
            }, {})
          })
          resolve(result)
        })
      })

      switch (sheet.title) {
        case 'News': {
          await fs.writeFile(
            `src/_data/${sheet.title.toLowerCase()}.json`,
            JSON.stringify(rows),
          )
          break
        }

        case 'Works': {
          await Promise.all(
            rows.map(async (row, index) => {
              await fs.writeFile(
                `src/works/${row.slug}.md`,
                `---
order: ${index}
${Object.entries(row)
  .map(([key, value]) => {
    return `${key}: ${value}`
  })
  .join('\n')}
---
`,
              )
            }),
          )
          break
        }
      }
    }),
  )
}

main().catch((error) => {
  console.trace(error)
})
