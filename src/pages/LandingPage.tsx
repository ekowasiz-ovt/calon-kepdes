import { AngkaDesa } from '../components/kampanye/AngkaDesa'
import { HeroKampanye } from '../components/kampanye/HeroKampanye'
import { ProfilKandidat } from '../components/kampanye/ProfilKandidat'
import { ProgramUnggulan } from '../components/kampanye/ProgramUnggulan'
import { VisiMisi } from '../components/kampanye/VisiMisi'

/**
 * Landing page kampanye: hero, angka desa, profil calon, visi & misi,
 * program unggulan. Header dan footer disediakan LayoutKampanye.
 */
export function LandingPage() {
  return (
    <>
      <HeroKampanye />
      <AngkaDesa />
      <ProfilKandidat />
      <VisiMisi />
      <ProgramUnggulan />
    </>
  )
}
