import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SelectList} from 'react-native-dropdown-select-list';

import {styles} from '../styles/styles';

export default function API() {
  // user selection states
  const [searchPlayer, setSearchPlayer] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  // data states
  const [playerData, setPlayerData] = useState([]);
  const [statComparisons, setStatComparisons] = useState([]);
  const [highestStats, setHighestStats] = useState({pts: 0, reb: 0, ast: 0});

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

  // years to populate dropdown from 1945-2023
  const years = [];
  for (let i = 2022; i > 1945; i--) {
    years.push({
      key: `${i}`,
      value: `${i}-${(i + 1).toString().slice(-2)}`,
    });
  }

  useEffect(() => {
    // check for highest stats
    statComparisons.forEach(player => {
      if (player.stats[0]?.pts >= highestStats.pts) {
        // DIRECT SET STATE DOESN'T WORK, FIND OUT WHY
        // setHighestStats({...highestStats, pts: player.stats[0]?.pts});
        highestStats.pts = player.stats[0]?.pts;
        console.log(highestStats);
        console.log('Highest stats pts: ' + highestStats.pts);
      }
      if (player.stats[0]?.reb >= highestStats.reb) {
        // setHighestStats({...highestStats, reb: player.stats[0]?.reb});
        highestStats.reb = player.stats[0]?.reb;
        console.log(highestStats);
        console.log('Highest stats reb: ' + highestStats.reb);
      }
      // if (player.stats[0]?.ast >= highestStats.ast) {
      //   setHighestStats({...highestStats, ast: player.stats[0]?.ast});
      //   console.log('Highest stats ast: ' + highestStats.ast);
      // }
    });
  }, [statComparisons]);

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
            <View style={{padding: 2}}>
              <TextInput
                multiline
                value={searchPlayer}
                placeholder="Search Player"
                style={styles.input}
                onChangeText={e => setSearchPlayer(e)}
              />
            </View>
            <View style={{padding: 2}}>
              <SelectList
                data={years}
                setSelected={setSelectedYear}
                placeholder="Select Year"
              />
            </View>
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
                onPress={() => {
                  setHighestStats({pts: 0, reb: 0, ast: 0});
                  setStatComparisons([]);
                }}
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
                const isHighestPoints =
                  player.stats[0]?.pts === highestStats.pts;
                const isHighestRebounds =
                  player.stats[0]?.reb === highestStats.reb;
                // const isHighestAssists =
                //   player.stats[0]?.ast === highestStats.ast;

                const ptsStyles = {
                  color: isHighestPoints ? 'green' : 'black',
                  fontWeight: isHighestPoints ? 'bold' : 'normal',
                };
                const rebStyles = {
                  color: isHighestRebounds ? 'green' : 'black',
                  fontWeight: isHighestRebounds ? 'bold' : 'normal',
                };
                // const astStyles = {
                //   color: isHighestAssists ? 'green' : 'black',
                //   fontWeight: isHighestAssists ? 'bold' : 'normal',
                // };

                return (
                  <View
                    key={`${player.id}.${player.selectedYear}`}
                    style={styles.playerStats}>
                    <View style={styles.playerNameStats}>
                      <Text style={styles.nameText}>{player.firstName}</Text>
                      <Text style={styles.nameText}>{player.lastName}</Text>
                    </View>
                    <Text>{player.selectedYear}</Text>
                    <Text style={ptsStyles}>{player.stats[0]?.pts || 0}</Text>
                    <Text style={rebStyles}>{player.stats[0]?.reb || 0}</Text>
                    <Text
                    // style={astStyles}
                    >
                      {player.stats[0]?.ast || 0}
                    </Text>
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
