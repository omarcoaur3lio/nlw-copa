import { Box, FlatList, useToast } from 'native-base';
import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { EmptyMyPoolList } from './EmptyMyPoolList';
import { Game, GameProps } from './Game';
import { Loading } from './Loading';

interface Props {
  poolId: string;
  code: string;
}

export function Guesses({ poolId, code }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [games, setGames] = useState<GameProps[]>([]);
  const [firstTeamGoals, setFirstTeamGoals] = useState('');
  const [secondTeamGoals, setSecondTeamGoals] = useState('');

  const toast = useToast();

  async function fetchGames() {
    try {
      setIsLoading(true);

      const response = await api.get(`/pools/${poolId}/games`);
      setGames(response.data.games);

    } catch (error) {
      console.log(error);
      toast.show({
        title: 'Não foi possível carregar os jogos',
        placement: 'top',
        bgColor: 'red.500',
        paddingX: '8'
      });

    } finally {
      setIsLoading(false);
    }
  }


  async function handleGuessConfirm(gameId: string) {
    try {
      setIsLoading(true);
      if (!firstTeamGoals.trim() || !secondTeamGoals.trim()) {
        return toast.show({
          title: 'Informe seu palpite para ambos os times',
          placement: 'top',
          bgColor: 'red.500',
          paddingX: '8'
        });
      }

      await api.post(`/pools/${poolId}/games/${gameId}/guesses`, {
        firstTeamGoals: Number(firstTeamGoals),
        secondTeamGoals: Number(secondTeamGoals)
      });

      toast.show({
        title: 'Palpite reallizado com sucesso',
        placement: 'top',
        bgColor: 'green.500',
        paddingX: '8'
      });

      fetchGames();

    } catch (error) {
      setIsLoading(false);
      console.log(error);
      toast.show({
        title: 'Não foi possível enviar o palpite',
        placement: 'top',
        bgColor: 'red.500',
        paddingX: '8'
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchGames();
  }, [poolId])

  if (isLoading) {
    <Loading />
  }

  return (
    <FlatList
      data={games}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <Game
          data={item}
          setFirstTeamPoints={setFirstTeamGoals}
          setSecondTeamPoints={setSecondTeamGoals}
          onGuessConfirm={() => handleGuessConfirm(item.id)}
        />
      )}
      _contentContainerStyle={{ pb: 10 }}
      ListEmptyComponent={() => <EmptyMyPoolList code={code} />}
    />
  );
}
