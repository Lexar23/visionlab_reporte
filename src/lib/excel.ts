import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';
import { ReportData } from '@/types/report';

export async function getReportData(): Promise<ReportData[]> {
    const filePath = path.join(process.cwd(), 'public', 'assets', 'reporte.xlsx');

    if (!fs.existsSync(filePath)) {
        console.error('File not found:', filePath);
        return [];
    }

    const fileBuffer = fs.readFileSync(filePath);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer', cellDates: true });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1 });
    const dataRows = rows.slice(1);

    return dataRows
        .filter(row => row[0])
        .map((row) => ({
            sucursal: String(row[0] || 'N/A').trim(),
            cliente: String(row[1] || 'N/A').trim(),
            factura: String(row[3] || 'N/A').trim(),
            estado: String(row[5] || 'N/A'),
            fecha: row[6] instanceof Date ? row[6] : new Date(),
            total: typeof row[14] === 'number' ? row[14] : 0,
            cantidad: typeof row[10] === 'number' ? row[10] : 0,
            servicioArticulo: String(row[9] || 'N/A'),
            ordenProduccion: String(row[8] || ''),
            retrabajo: !!row[19] && String(row[19]).trim() !== '' && String(row[19]) !== 'N/A',
            optometra: String(row[20] || row[19] || 'Desconocido').trim(),
        }));
}
