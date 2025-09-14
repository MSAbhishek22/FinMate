import { motion } from 'framer-motion'
import { DollarSign, TrendingUp, PiggyBank, CreditCard, Smartphone, Coffee } from 'lucide-react'

const GenZMoneyTips = () => {
  const genZTips = [
    {
      id: 1,
      title: "The Latte Factor is Real ☕",
      description: "That daily $5 coffee = $1,825/year. Make coffee at home 4 days a week and save $1,460!",
      icon: Coffee,
      color: "from-orange-500 to-red-500",
      category: "spending",
      relatable: "Skip the Starbucks run, make TikTok-worthy coffee at home"
    },
    {
      id: 2,
      title: "Automate Like Your Spotify Playlist 🎵",
      description: "Set up automatic transfers to savings. Even $25/week = $1,300/year without thinking about it.",
      icon: Smartphone,
      color: "from-green-500 to-emerald-500",
      category: "saving",
      relatable: "Set it and forget it - like your favorite playlist on repeat"
    },
    {
      id: 3,
      title: "Credit Cards Aren't Free Money 💳",
      description: "Only spend what you can pay off immediately. Credit card debt at 25% APR is expensive AF.",
      icon: CreditCard,
      color: "from-red-500 to-pink-500",
      category: "credit",
      relatable: "Treat your credit card like a debit card with rewards"
    },
    {
      id: 4,
      title: "Start Investing with Pocket Change 📱",
      description: "Apps like Acorns round up purchases and invest the change. $0.50 here, $1.20 there adds up!",
      icon: TrendingUp,
      color: "from-purple-500 to-indigo-500",
      category: "investing",
      relatable: "Turn your spare change into future wealth - it's like magic"
    },
    {
      id: 5,
      title: "Emergency Fund = Peace of Mind 🛡️",
      description: "Save $1,000 first, then 3-6 months of expenses. Your future self will thank you.",
      icon: PiggyBank,
      color: "from-blue-500 to-cyan-500",
      category: "emergency",
      relatable: "Because life happens and you don't want to move back with parents"
    },
    {
      id: 6,
      title: "Side Hustle Your Skills 💪",
      description: "Good at design? Photography? Tutoring? Turn your skills into extra income streams.",
      icon: DollarSign,
      color: "from-yellow-500 to-orange-500",
      category: "income",
      relatable: "Monetize your talents - everyone has something valuable to offer"
    }
  ]

  return (
    <div className="space-y-6">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gradient mb-3 sm:mb-4">
          Money Tips for Gen-Z 🚀
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 px-4">
          Real talk about money - no boring financial jargon, just practical advice that actually works
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {genZTips.map((tip, index) => {
          const IconComponent = tip.icon
          
          return (
            <motion.div
              key={tip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card group hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r ${tip.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2 gap-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base flex-1">
                      {tip.title}
                    </h3>
                    <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium capitalize flex-shrink-0 ${
                      tip.category === 'spending' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                      tip.category === 'saving' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      tip.category === 'credit' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                      tip.category === 'investing' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                      tip.category === 'emergency' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {tip.category}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                    {tip.description}
                  </p>
                  
                  <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-lg p-3">
                    <p className="text-sm font-medium text-primary-700 dark:text-primary-300">
                      💡 {tip.relatable}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center mt-12"
      >
        <div className="card bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Level Up Your Money Game? 🎮
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Start with one tip today. Small changes lead to big results over time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary">
              Track My First Expense 📊
            </button>
            <button className="btn-secondary">
              Set Savings Goal 🎯
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default GenZMoneyTips
