import { Typography, Card, CardContent, Grid } from "@mui/material";
function InfoCard({ labels, values }) {
  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          {labels.map((label, index) => (
            <Grid
              item
              xs={12}
              key={label}
              container
              spacing={2}
              alignItems="center"
              sx={{ borderBottom: "1px solid black" }}
            >
              <Grid item xs={3}>
                <Typography variant="h6">{label}</Typography>
              </Grid>
              <Grid item xs={9}>
                <Typography textAlign="center">{values[index]}</Typography>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}
export default InfoCard;
