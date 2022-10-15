const express = require("express");
const fs = require("fs/promises");
const app = express();

const PORT = 8080;

app.use(express.json());

app.get("/teams", async (req, res) => {
  try {
    const teams = await fs.readFile(__dirname + "/db/database.txt", "utf-8");
    const teamsParsed = JSON.parse(teams);
    res.status(200).json(teamsParsed);
  } catch (error) {
    res.status(404).json({ message: "Error", errorMessage: error.message });
  }
});

app.get("/teams/:id", async (req, res) => {
  try {
    const teams = await fs.readFile(__dirname + "/db/database.txt", "utf-8");
    const id = req.params.id;
    const teamsParsed = JSON.parse(teams);
    const team = teamsParsed.find((ele) => ele.id === Number(id));
    if (team) res.status(200).json(team);
    res
      .status(404)
      .json({ message: "Error", errorMessage: "equipo no encontrado" });
  } catch (error) {
    res.status(404).json({ message: "Error", errorMessage: error.message });
  }
});

app.post("/teams", async (req, res) => {
  try {
    const newTeamBody = req.body;
    const teams = await fs.readFile(__dirname + "/db/database.txt", "utf-8");
    const teamsParsed = JSON.parse(teams);
    let maxId = 0;
    teamsParsed.forEach((team) => {
      if (team.id > maxId) maxId = team.id;
    });
    const newId = maxId + 1;
    const newTeam = { id: newId, ...newTeamBody };
    teamsParsed.push(newTeam);
    const stringTeamsParsed = JSON.stringify(teamsParsed);
    await fs.writeFile(
      __dirname + "/db/database.txt",
      stringTeamsParsed,
      "utf-8"
    );
    res.status(200).json({ message: "Equipo creado con éxito" });
  } catch (error) {
    res.status(404).json({ message: "Error", errorMessage: error.message });
  }
});
console.log("hola");
app.listen(PORT, () => {
  console.log(`Escuchando en puerto ${PORT}`);
});

app.put("/teams/:id", async (req, res) => {
  try {
    const newTeamBody = req.body;
    const teams = await fs.readFile(__dirname + "/db/database.txt", "utf-8");
    const teamsParsed = JSON.parse(teams);
    const id = req.params.id;

    const team = teamsParsed.find((ele) => ele.id === Number(id));
    if (!team)
      res
        .status(404)
        .json({ message: "Error", errorMessage: "equipo no encontrado" });

    const newTeams = teamsParsed.map((team) =>
      team.id === Number(id)
        ? {
            id: Number(id),
            country: newTeamBody.country,
            flag_url: newTeamBody.flag_url,
            group: newTeamBody.group,
          }
        : team
    );
    const stringTeamsParsed = JSON.stringify(newTeams);
    await fs.writeFile(
      __dirname + "/db/database.txt",
      stringTeamsParsed,
      "utf-8"
    );
    res.status(200).json({ message: "Equipo Modificado con éxito" });
  } catch (error) {
    res.status(404).json({ message: "Error", errorMessage: error.message });
  }
});

app.delete("/teams/:id", async (req, res) => {
  try {
    const teams = await fs.readFile(__dirname + "/db/database.txt", "utf-8");
    const teamsParsed = JSON.parse(teams);
    const id = req.params.id;
    const team = teamsParsed.find((ele) => ele.id === Number(id));
    if (!team)
      res
        .status(404)
        .json({ message: "Error", errorMessage: "equipo no encontrado" });
    const newTeams = teamsParsed.filter((team) => team.id !== Number(id));
    const stringTeamsParsed = JSON.stringify(newTeams);
    await fs.writeFile(
      __dirname + "/db/database.txt",
      stringTeamsParsed,
      "utf-8"
    );
    res.status(200).json({ message: "Equipo Eliminado con éxito" });
  } catch (error) {
    res.status(404).json({ message: "Error", errorMessage: error.message });
  }
});
