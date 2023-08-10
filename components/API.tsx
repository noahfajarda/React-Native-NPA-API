import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {SelectList} from 'react-native-dropdown-select-list';

export default function API() {
  // user selection states
  const [searchPlayer, setSearchPlayer] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  // data states
  const [playerData, setPlayerData] = useState([]);
  const [statComparisons, setStatComparisons] = useState([]);

  // retrieve players & set state
  const getPlayers = async player => {
    const res = await fetch(
      `https://www.balldontlie.io/api/v1/players?search=${player}&per_page=15`,
    );
    const data = await res.json(); // first_name, id, last_name, team.full_name
    setPlayerData(data.data);
  };

  const handlePlayerPress = async (id, firstName, lastName, selectedYear) => {
    // set selected year if not specified
    selectedYear = selectedYear ? selectedYear : '2022';

    // return early if player already selected for comparison
    let objectExists = statComparisons.some(
      object => object?.id === id && object?.selectedYear === selectedYear,
    );
    if (objectExists) return;

    // fetch API call
    const res = await fetch(
      `https://www.balldontlie.io/api/v1/season_averages?season=${selectedYear}&player_ids[]=${id}`,
    );
    const data = await res.json();

    // add fetched data to 'stat comparisons'
    setStatComparisons([
      ...statComparisons,
      {id, firstName, lastName, selectedYear, stats: data.data},
    ]);
  };

  // years to populate dropdown
  const years = [];
  for (let i = 2022; i > 1945; i--) {
    years.push({
      key: `${i}`,
      value: `${i}-${(i + 1).toString().slice(-2)}`,
    });
  }

  return (
    <ScrollView>
      <View>
        {/* title */}
        <Text style={styles.title}>NBA API Player Search</Text>

        {/* search section */}
        <View>
          {/* input container */}
          <View style={styles.inputContainer}>
            {/* search for 'name' & 'year' */}
            <TextInput
              multiline
              value={searchPlayer}
              placeholder="Search Player"
              style={styles.input}
              onChangeText={e => setSearchPlayer(e)}
            />
            <SelectList
              data={years}
              setSelected={setSelectedYear}
              placeholder="Select Year"
            />
          </View>

          {/* search button */}
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
              <Button
                onPress={() => getPlayers(searchPlayer)}
                title="Search Player"
                color="#6ae6b8"
                accessibilityLabel="Search NBA Players"
              />
            </View>
          </View>

          {/* clear button */}
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
              <Button
                onPress={() => setStatComparisons([])}
                title="Reset Comparisons"
                color="#f2072b"
                accessibilityLabel="Reset Comparisons"
              />
            </View>
          </View>
        </View>

        {/* display stats if available */}
        <View style={styles.statComparisonsContainer}>
          {statComparisons.length ? (
            <View>
              <View style={styles.statComparisonsHeader}>
                <Text style={styles.headerText}>Player</Text>
                <Text style={styles.headerText}>Year</Text>
                <Text style={styles.headerText}>Pts</Text>
                <Text style={styles.headerText}>Rbs</Text>
                <Text style={styles.headerText}>Asts</Text>
              </View>
              {statComparisons.map(player => {
                return (
                  <View
                    key={`${player.id}.${player.selectedYear}`}
                    style={styles.playerStats}>
                    <View style={styles.playerNameStats}>
                      <Text style={styles.nameText}>{player.firstName}</Text>
                      <Text style={styles.nameText}>{player.lastName}</Text>
                    </View>
                    <Text>{player.selectedYear}</Text>
                    <Text>{player.stats[0]?.pts || 0}</Text>
                    <Text>{player.stats[0]?.reb || 0}</Text>
                    <Text>{player.stats[0]?.ast || 0}</Text>
                    {/* also have access to stl, blk, turnover, fg_pct, fg3_pct, ft_pct */}
                  </View>
                );
              })}
            </View>
          ) : (
            <View></View>
          )}
        </View>

        {/* check player data & map through it */}
        {playerData.length !== 0 ? (
          <View>
            {playerData.map(player => (
              // make it a clickable element
              <TouchableOpacity
                key={player?.id}
                style={styles.playerContainer}
                onPress={() =>
                  handlePlayerPress(
                    player?.id,
                    player?.first_name,
                    player?.last_name,
                    selectedYear,
                  )
                }>
                <Text style={styles.playerName}>
                  {player?.last_name}, {player?.first_name}
                </Text>
                <Text style={styles.playerTeam}>
                  Team: {player?.team.full_name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.playerContainer}>
            <Text style={styles.playerName}>Search For A Player!</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
