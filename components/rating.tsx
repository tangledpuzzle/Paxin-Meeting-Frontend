import { useCallback, useEffect } from 'react';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';

const FIRSTNAMES = [
  'John',
  'Steve',
  'Marc',
  'Franklin',
  'Isaac',
  'Vincent',
  'Edwin',
  'Ashlyn',
  'Anthony',
  'Alia',
  'Abby',
  'Francesca',
];

const LASTNAMES = [
  '87:20',
  '12:21',
  '31:21',
  '77:40',
  '84:20',
  '48:20',
  '144:50',
  '21:26',
  '55:51',
  '43:21',
  '43:57',
  '55:41',
  '23:50',
];

const TITLES = [
  'CEO',
  'President',
  'Vice President',
  'Director',
  'Manager',
  'Developer',
];

const TableRating = () => {
  const rand = useCallback((a: number, b: number) => Math.floor(Math.random() * b + a), []);

  const switchPage = useCallback((pagination: HTMLElement, table: HTMLElement, index: number, bypass: number = -1) => {
    const BTN_WIDTH = 4;
    const limit = parseInt(table.getAttribute('data-limit') || '10');
    const rows = table.querySelectorAll('.table-row:not(.table-heading)');
    const buttons = pagination.querySelectorAll('li');
    const last_active = pagination.querySelector('li.active');
    const x_pos = parseInt(pagination.getAttribute('data-x') || '0');
    let x_shift = 0;
    const target_pos = (-index + 2) * BTN_WIDTH;
    const page_count = Math.ceil(rows.length / limit);

    if (bypass !== -1) {
      x_shift = (-bypass + 2) * BTN_WIDTH;
    } else {
      if (index > 1 && index < buttons.length - 2) {
        x_shift = target_pos;
      } else if (index === 1) {
        x_shift = 0;
      } else if (index === page_count - 2) {
        x_shift = (-page_count + 5) * BTN_WIDTH;
      } else {
        x_shift = x_pos;
      }
    }

    rows.forEach((row, row_index) => {
      if (row_index < index * limit || row_index >= index * limit + limit) {
        (row as HTMLElement).style.display = 'none';
      } else {
        (row as HTMLElement).style.display = 'flex';
        (row as HTMLElement).style.opacity = '0';

        setTimeout(() => {
          (row as HTMLElement).style.opacity = '1';
        }, 50);
      }
    });

    last_active?.classList.remove('active');
    buttons[index]?.classList.add('active');
    pagination.style.transform = 'translateX(' + x_shift + 'rem)';
    pagination.setAttribute('data-x', x_shift.toString());

    updatePaginationInfos(pagination, table, page_count, index);
    updatePaginationProgress(pagination, index, page_count - 1);
  }, []);

  const initPaginationSteppedExtremes = useCallback((pagination: HTMLElement, table: HTMLElement, container: HTMLElement, max: number) => {
    const left = container?.querySelector('.pagination-left-one') as HTMLLIElement;
    const right = container?.querySelector('.pagination-right-one') as HTMLLIElement;

    if (left !== null && left !== undefined) {
      left.addEventListener('click', () => {
        const last_active = pagination.querySelector('li.active') as HTMLLIElement;
        const buttons = pagination.querySelectorAll('li');
        const last_index = Array.from(buttons).indexOf(last_active);

        if (last_index > 0) switchPage(pagination, table, last_index - 1);
      });
    }

    if (right !== null && right !== undefined) {
      right.addEventListener('click', () => {
        const last_active = pagination.querySelector('li.active') as HTMLLIElement;
        const buttons = pagination.querySelectorAll('li');
        const last_index = Array.from(buttons).indexOf(last_active);

        if (last_index < max - 1) switchPage(pagination, table, last_index + 1);
      });
    }
  }, [switchPage]);

  const initPaginationExtremes = useCallback((pagination: HTMLElement, table: HTMLElement, max: number) => {
    const container = pagination.closest('.pagination-container') as HTMLElement;
    const left = container?.querySelector('.pagination-left');
    const right = container?.querySelector('.pagination-right');

    if (left !== null && left !== undefined) {
      left.addEventListener('click', () => {
        switchPage(pagination, table, 0, Math.min(2, max - 1));
      });
    }

    if (right !== null && right !== undefined) {
      right.addEventListener('click', () => {
        switchPage(pagination, table, max - 1, Math.max(0, max - 3));
      });
    }

    initPaginationSteppedExtremes(pagination, table, container, max);
  }, [initPaginationSteppedExtremes, switchPage]);

  const initCopies = useCallback(() => {
    const targets = [...document.querySelectorAll('*[data-copy]')];

    targets.reverse().forEach((original) => {
      const amountString = original.getAttribute('data-copy');

      if (amountString !== null) {
        const amount = parseInt(amountString, 10);

        if (original.parentNode !== null) {
          for (let i = 0; i < amount; i++) {
            const copy = original.cloneNode(true);
            original.parentNode.insertBefore(copy, original.nextSibling);
          }
        } else {
          console.error('Parent node is null for element:', original);
        }
      }
    });
  }, []);

  const initAutoIncrements = useCallback(() => {
    const autos = document.querySelectorAll('.auto-increment');

    autos.forEach((auto, i) => {
      auto.innerHTML = `${i + 1}`;
    });
  }, []);

  const initAutoFirstnames = useCallback(() => {
    const autos = document.querySelectorAll('.auto-firstname');

    autos.forEach((auto) => {
      auto.innerHTML = FIRSTNAMES[rand(0, FIRSTNAMES.length)];
    });
  }, [rand]);

  const initAutoLastnames = useCallback(() => {
    const autos = document.querySelectorAll('.auto-lastname');

    autos.forEach((auto) => {
      auto.innerHTML = LASTNAMES[rand(0, LASTNAMES.length)];
    });
  }, [rand]);

  const initAutoTitles = useCallback(() => {
    const autos = document.querySelectorAll('.auto-title');

    autos.forEach((auto) => {
      auto.innerHTML = TITLES[rand(0, TITLES.length)];
    });
  }, [rand]);

  const initAutoIntegers = useCallback(() => {
    const autos = document.querySelectorAll('.auto-integer');

    autos.forEach((auto) => {
      const minString = auto.getAttribute('min');
      const maxString = auto.getAttribute('max');

      if (minString !== null && maxString !== null) {
        const min = parseInt(minString);
        const max = parseInt(maxString);

        if (!isNaN(min) && !isNaN(max)) {
          auto.innerHTML = rand(min, max).toString();
        } else {
          console.error('Invalid min or max value:', minString, maxString);
        }
      } else {
        console.error('min or max attribute is missing for element:', auto);
      }
    });
  }, [rand]);

  const createPagination = useCallback((pagination: HTMLElement, table: HTMLElement): void => {
    const limit = parseInt(table.getAttribute('data-limit') || '10');
    const rows = table.querySelectorAll('.table-row:not(.table-heading)');
    const page_count = Math.ceil(rows.length / limit);
    console.log(page_count);
    for (let i = 0; i < page_count; i++) {
      const new_button = document.createElement('li');
      new_button.innerHTML = '<span>' + (i + 1) + '</span>';

      if (i === 0) new_button.classList.add('active');

      pagination.appendChild(new_button);

      new_button.addEventListener('click', () => {
        switchPage(pagination, table, i);
      });
    }

    updatePaginationInfos(pagination, table, page_count, 0);
    initPaginationExtremes(pagination, table, page_count);
  }, [switchPage, initPaginationExtremes]);


  const initPaginations = useCallback(() => {
    const paginations = document.querySelectorAll('.pagination');

    paginations.forEach((pagination) => {
      const tableId = pagination.getAttribute('data-table');
      if (tableId !== null) {
        const table = document.getElementById(tableId);
        pagination.setAttribute('data-x', '0');
        if (table !== null) {
          const tableContainer = pagination.closest('.table-container');
          if (tableContainer !== null) {
            createPagination(pagination as HTMLElement, table as HTMLElement);
          } else {
            console.error(
              "No ancestor with class 'table-container' found for pagination:",
              pagination
            );
          }
        }
      }
    });
  }, [createPagination]);

  const initAutoLimits = useCallback(() => {
    const table_containers = document.querySelectorAll('.table-container');
    const limit = window.innerHeight / 70;

    table_containers.forEach((container: Element) => {
      const table = container.querySelector('.table');

      container.setAttribute('style', '--data-limit: ' + limit);
      table?.setAttribute('data-limit', limit.toString());
    });
  }, []);


  function updatePaginationInfos(
    pagination: HTMLElement,
    table: HTMLElement,
    page_count: number,
    index: number
  ): void {
    const info = pagination
      .closest('.pagination-container')
      ?.querySelector('.pagination-info');

    if (info === null || info === undefined) return;

    let from = 0,
      to = 0;
    const rows = table.querySelectorAll('.table-row:not(.table-heading)');
    let started = false;

    for (let i = 1; i < rows.length; i++) {
      const display = (rows[i - 1] as HTMLElement).style.display;

      if (display !== 'none' && !started) {
        started = true;
        from = i;
      } else if ((display === 'none' && started) || i == rows.length - 1) {
        to = i == rows.length - 1 ? rows.length : i - 1;
        break;
      }
    }

    info.innerHTML =
      'Displaying ' +
      from +
      '-' +
      to +
      ' on page ' +
      (index + 1) +
      '/' +
      page_count;
  }

  function updatePaginationProgress(
    pagination: HTMLElement,
    index: number,
    total: number
  ): void {
    const dot = pagination
      .closest('.table-container')
      ?.querySelector('.progress-point') as HTMLElement;

    if (dot !== null) {
      dot.style.left = (index / total) * 100 + '%';
    }
  }

  useEffect(() => {
    initCopies();
    initAutoLimits();
    initAutoIncrements();
    initAutoFirstnames();
    initAutoLastnames();
    initAutoTitles();
    initAutoIntegers();
    initPaginations();
  }, [
    initCopies,
    initAutoLimits,
    initAutoIncrements,
    initAutoFirstnames,
    initAutoLastnames,
    initAutoTitles,
    initAutoIntegers,
    initPaginations,
  ]);

  return (
    <div className='mx-auto w-[90%] px-0 pb-8'>
      <div className='table-container mx-auto md:w-full'>
        <div className='table' id='table-0' data-limit='9'>
          <div className='table-heading table-row'>
            <div className='table-col'>Profile</div>
            <div className='table-col'>Online time</div>
          </div>

          <div className='table-row' data-copy='10'>
            <div className='table-col'>
              <span className='auto-firstname'></span>
            </div>
            <div className='table-col'>
              <span className='auto-lastname'></span>
            </div>
          </div>
        </div>

        <div className='pagination-container'>
          <div className='flex'>
            <div className='d-flex flex-fill justify-content-center'>
              <div className='pagination-wrapper'>
                <ul className='pagination' data-table='table-0'></ul>
              </div>
            </div>
            <span className='pagination-info !hidden'></span>
            <div className='flex items-center justify-center'>
              <button className='pagination-extreme pagination-left-one'>
                <FaChevronLeft />
              </button>
              <button className='pagination-extreme pagination-right-one'>
                <FaChevronRight />
              </button>
            </div>
          </div>
        </div>

        <div className='progress-bar'>
          <div className='progress-point'></div>
        </div>
      </div>
    </div>
  );
};

export default TableRating;
