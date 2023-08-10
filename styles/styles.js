import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  title: {
    display: 'flex',
    padding: 20,
    fontSize: 30,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'teal',
  },
  input: {
    backgroundColor: '#c7d7f0',
    borderRadius: 10,
    padding: 10,
    width: '100%',
  },
  inputContainer: {
    padding: 10,
  },
  buttonContainer: {
    alignItems: 'center',
    width: '100%',
    padding: 5,
  },
  button: {
    width: '60%',
  },
  playerContainer: {
    padding: 10,
    alignItems: 'center',
  },
  playerName: {
    fontWeight: '600',
    color: '#313794',
    fontSize: 20,
  },
  playerTeam: {
    fontWeight: '300',
  },
  statComparisonsContainer: {
    display: 'flex',
    width: '100%',
    padding: 15,
  },
  statComparisonsHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 25,
    paddingRight: 5,
    paddingTop: 5,
    paddingBottom: 5,
  },
  nameText: {
    color: 'red',
  },
  headerText: {
    color: 'black',
  },
  playerStats: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
  },
  playerNameStats: {
    display: 'flex',
    flexDirection: 'column',
    padding: 2,
    alignItems: 'center',
    width: 70,
  },
});
