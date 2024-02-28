import React, { useMemo } from 'react';
import useAxios from 'axios-hooks';
import {
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';

interface DespesaItem {
  id: number;
  descricao: string;
  categoria: string;
  valor: number;
  mes: string;
  dia: string;
}

export function Despesas(): React.JSX.Element {
  const [{ data, loading, error }] = useAxios<DespesaItem[]>(
    'https://confirmed-maroon-dingo.glitch.me/api/despesas'
  );
  const [year, setYear] = React.useState('');
  const [month, setMonth] = React.useState('');

  const { filteredData, years } = useMemo(() => {
    const filteredData =
      data?.filter(despesa => {
        const currentYear = despesa.mes.split('-')[0];
        const currentMonth = despesa.mes.split('-')[1];

        return (
          (!year || currentYear === year) && (!month || currentMonth === month)
        );
      }) ?? [];

    const years: string[] = [];

    data?.forEach(despesa => {
      const currentMonth = despesa.mes.split('-')[0];
      if (!years.includes(currentMonth)) {
        years.push(currentMonth);
      }
    });

    return {
      filteredData,
      years,
    };
  }, [data, year, month]);

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error!</p>;

  return (
    <Container>
      <h1 style={{ textAlign: 'center' }}>Despesas</h1>

      <Grid container spacing={2} style={{ marginBottom: 60 }}>
        <Grid item xs={8}>
          <FormControl style={{ marginRight: 10 }}>
            <InputLabel id="year-label">Ano</InputLabel>
            <Select
              labelId="year-label"
              id="year-select"
              label="Ano"
              value={year}
              onChange={v => setYear(v.target.value)}
              style={{ width: 100 }}
            >
              {years.map(year => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel id="month-label">Mês</InputLabel>
            <Select
              labelId="month-label"
              id="month-select"
              label="Mês"
              value={month}
              onChange={v => setMonth(v.target.value)}
              style={{ width: 100 }}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="01">Janeiro</MenuItem>
              <MenuItem value="02">Fevereiro</MenuItem>
              <MenuItem value="03">Março</MenuItem>
              <MenuItem value="04">Abril</MenuItem>
              <MenuItem value="05">Maio</MenuItem>
              <MenuItem value="06">Junho</MenuItem>
              <MenuItem value="07">Julho</MenuItem>
              <MenuItem value="08">Agosto</MenuItem>
              <MenuItem value="09">Setembro</MenuItem>
              <MenuItem value="10">Outubro</MenuItem>
              <MenuItem value="11">Novembro</MenuItem>
              <MenuItem value="12">Dezembro</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid
          item
          xs={4}
          style={{ display: 'flex', justifyContent: 'flex-end' }}
        >
          <span>
            Despesa total:{' '}
            {filteredData
              ?.reduce((acc, x) => acc + x.valor, 0)
              .toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
          </span>
        </Grid>
      </Grid>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Despesa</TableCell>
            <TableCell>Categoria</TableCell>
            <TableCell>Dia</TableCell>
            <TableCell>Valor (R$)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredData?.map(despesa => (
            <TableRow key={despesa.id}>
              <TableCell>{despesa.descricao}</TableCell>
              <TableCell>{despesa.categoria}</TableCell>
              <TableCell>{despesa.dia}</TableCell>
              <TableCell>
                {despesa.valor.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}
