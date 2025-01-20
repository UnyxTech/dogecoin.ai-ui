import { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import { effectiveBalance } from '@/utils';

interface iAdaptiveBalance {
  balance: string;
}

const AdaptiveBalance = ({ balance }: iAdaptiveBalance) => {
  const [content, setContent] = useState('');
  useEffect(() => {
    if (isEmpty(balance)) {
      setContent('-');
      return;
    }
    const normalBalance = parseFloat(balance).toFixed(15);
    let formattedBalance = '';
    const parts = normalBalance.split('.');
    if (parts.length === 2 && parts[1].length > 1 && Number(parts[1]) > 0) {
      const zerosMatch = parts[1].match(/^0+/);
      if (zerosMatch && zerosMatch[0].length > 4) {
        const exponent = parseInt(parts[1]).toString().substring(0, 4);
        formattedBalance = `${parts[0]}.<span>0<sub>${zerosMatch[0].length}</sub>${exponent}</span>`;
      } else {
        formattedBalance = `<span>${effectiveBalance(normalBalance)}</span>`;
      }
    } else {
      formattedBalance = `<span>${effectiveBalance(normalBalance)}</span>`;
    }
    setContent(formattedBalance);
  }, [balance]);

  const createMarkup = (htmlString: string) => ({ __html: htmlString });

  return <span dangerouslySetInnerHTML={createMarkup(content ? content : '0')} />;
};

export default AdaptiveBalance;
