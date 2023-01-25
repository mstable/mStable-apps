import { useUpdateQuestsMutation } from '@apps/artifacts/graphql/questbook'
import { getUnixTime } from 'date-fns'

import { useApolloClients } from '../context/ApolloProvider'
import { useAddQuestNotification } from '../context/NotificationsProvider'
import { useAccount } from '../context/WagmiProvider'

// TODO interval to update, or update with an exported hook?
export const QuestsUpdater = (): null => {
  const account = useAccount()
  const clients = useApolloClients()
  const addQuestNotification = useAddQuestNotification()

  // Update all quests when the user changes
  const [updateUserQuests] = useUpdateQuestsMutation({
    client: clients.questbook,
    onCompleted: data => {
      if (!data.updateQuests) return

      const nowUnix = getUnixTime(Date.now())

      data.updateQuests.forEach(({ title, objectives, userQuest }) => {
        if (userQuest?.completedAt && nowUnix - userQuest.completedAt < 30) {
          addQuestNotification(title)
        }

        ;(userQuest?.objectives ?? [])
          .filter(obj => obj.completedAt && nowUnix - obj.completedAt < 30)
          .forEach(obj => {
            const obj_ = objectives.find(_obj => _obj.id === obj.id)
            if (obj_) addQuestNotification(obj_.title, obj_.points)
          })
      })
    },
  })

  // Make this thing stop because it's not maintained anymore
  // useEffect(() => {
  //   if (account) {
  //     updateUserQuests({ variables: { userId: account ?? '', hasUser: !!account } }).catch(error => {
  //       console.error(error)
  //     })
  //   }
  // }, [updateUserQuests, account])

  return null
}
