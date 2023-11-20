import Loading from 'components/layout/loading'
import { ReactNode } from 'react'

export const Box = ({ children }: { children: ReactNode }) => (
  <div className="is-box has-pink-border is-size-7">{children}</div>
)

export const LoadingTDEX = ({ title }: { title: string }) => (
  <Box>
    <p className="has-text-centered">{title}</p>
    <p className="has-text-centered">
      <Loading />
    </p>
  </Box>
)

export const NotFound = ({ kind }: { kind: string }) => (
  <Box>
    <p className="has-text-centered">{`No ${kind} found`}</p>
  </Box>
)
