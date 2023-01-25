# Roboam
ICFPC infrastructure for task-based challenges

Detailed information about modules can be found in README.md inside modules

## Use cases:
### Tomorrow is the contest, how to prepare?
1. Clone repo
2. Go inside frontend directory and run `npm i` command (for Kontur: `npm i --registry=https://nexus.kontur.host/repository/kontur-npm-group/`)
3. Run `npm start` command
4. Open `localhost:3000` and check that mocks works
5. Write backend
6. Change `axios.defaults.baseURL` from `http://localhost:3001` to your own backend url
7. Be fine :)
