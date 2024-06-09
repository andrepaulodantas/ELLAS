import React from 'react';
import { PDFDownloadLink, Document, Page, Text, View } from '@react-pdf/renderer';
import { Table, TableHeader, TableBody, TableCell, TableRow } from '@david.kucsai/react-pdf-table';
import styles from './styles'; // Import your styles file

const PDFGenerator = ({ tableData }) => (
  <Document>
    <Page size="A4">
      <View style={styles.section}>
        <Text style={styles.title}>Tabela de Dados</Text>
        <Table>
          <TableHeader>
            <TableCell>Node</TableCell>
            <TableCell>Central Node</TableCell>
          </TableHeader>
          <TableBody>
            {tableData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.label}</TableCell>
                <TableCell>{row.centralNodeId}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </View>
    </Page>
  </Document>
);

export default PDFGenerator;