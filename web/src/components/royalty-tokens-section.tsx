import type { ComponentType, ReactElement } from 'react';
import React from 'react';
import type { PrivateRoyaltyToken, PublicRoyaltyToken } from '@/api/requests';

type Props<T extends PrivateRoyaltyToken | PublicRoyaltyToken> = {
  title: string;
  data: T[];
  Card: ComponentType<T>;
};

export default function RoyaltyTokensSection<T extends PrivateRoyaltyToken | PublicRoyaltyToken>({
  title,
  data,
  Card: Component,
}: Props<T>) {
  return (
    <section className="px-4 pb-8 pt-4">
      <h3 className="mb-6 text-3xl font-bold capitalize tracking-tight">{title}</h3>
      <div className="grid grid-cols-3 gap-4">
        {data.map((item) => (
          <Component key={item.symbol} {...item} />
        ))}
      </div>
    </section>
  );
}
