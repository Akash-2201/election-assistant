import { motion } from 'framer-motion';
import { UserPlus, FileSearch, Navigation, Hand } from 'lucide-react';

const STEPS = [
  {
    id: 1,
    title: 'Register to Vote',
    icon: UserPlus,
    guide: 'Ensure your name is on the electoral roll. You can apply online via the Voter Portal or fill Form 6.',
    color: 'from-blue-500 to-cyan-400'
  },
  {
    id: 2,
    title: 'Verify Your Identity',
    icon: FileSearch,
    guide: 'Keep your EPIC (Voter ID) ready. Alternatively, Aadhaar, PAN, or Passport are valid alternatives.',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 3,
    title: 'Find Your Booth',
    icon: Navigation,
    guide: 'Check your polling booth slip. Booths are open from 7 AM to 6 PM on your designated polling day.',
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 4,
    title: 'The EVM',
    icon: Hand,
    guide: 'Press the blue button next to your candidate of choice on the Electronic Voting Machine. Wait for the beep and check the VVPAT slip.',
    color: 'from-green-500 to-emerald-400'
  }
];

export default function Roadmap() {
  return (
    <section className="py-12 relative">
      <h2 className="text-3xl font-bold mb-12 text-center">Your Interactive Roadmap</h2>
      
      <div className="max-w-3xl mx-auto relative">
        {/* Timeline Line */}
        <div className="absolute left-[28px] md:left-1/2 top-4 bottom-4 w-1 bg-slate-800 rounded-full md:-translate-x-1/2" />

        <div className="space-y-12">
          {STEPS.map((step, index) => {
            const isEven = index % 2 === 0;
            const Icon = step.icon;
            
            return (
              <motion.div 
                key={step.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`flex flex-col md:flex-row relative ${isEven ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Center Node */}
                <div className="absolute left-0 md:left-1/2 w-14 h-14 rounded-full bg-slate-900 border-4 border-slate-950 flex items-center justify-center z-10 md:-translate-x-1/2 shadow-xl shadow-black/50">
                  <div className={`w-full h-full rounded-full bg-gradient-to-br ${step.color} opacity-20 absolute`} />
                  <Icon className="w-6 h-6 text-white relative z-10" />
                </div>

                {/* Content Card */}
                <div className={`ml-20 md:ml-0 md:w-1/2 ${isEven ? 'md:pl-12' : 'md:pr-12'} pt-2`}>
                  <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
                    <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${step.color}`} />
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-800 px-2 py-1 rounded-md">
                        Step {step.id}
                      </span>
                      <h3 className="text-xl font-bold">{step.title}</h3>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      {step.guide}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
