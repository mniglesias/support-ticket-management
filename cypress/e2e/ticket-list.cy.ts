describe('Lista de Tickets y filtros', () => {
  beforeEach(() => {
    cy.visit('/tickets');
  });

  it('debe mostrar la lista de tickets con ítems cargados', () => {
    // Verifica que el encabezado de la app sea visible
    cy.contains('Gestor de Tickets').should('be.visible');

    // Espera a que los skeletons desaparezcan y aparezcan las cards
    cy.get('[data-cy="loading-skeleton"]').should('not.exist');
    cy.get('[data-cy="ticket-card"]').should('have.length.greaterThan', 0);
  });

  it('debe filtrar por estado DONE usando los filtros avanzados', () => {
    // Espera la carga inicial
    cy.get('[data-cy="loading-skeleton"]').should('not.exist');
    cy.get('[data-cy="ticket-card"]').should('have.length.greaterThan', 0);

    // Abre el panel de filtros avanzados
    cy.get('[data-cy="filters-toggle"]').click();

    // Selecciona el estado DONE en el filtro de estado
    cy.get('[data-cy="filter-status"]').click();
    cy.contains('mat-option', 'Done').click();

    // Cierra el dropdown del select
    cy.get('body').type('{esc}');

    // Espera que los resultados se actualicen
    cy.wait(1200);
    cy.get('[data-cy="loading-skeleton"]').should('not.exist');

    // Verifica que todos los tickets visibles tengan estado DONE
    cy.get('[data-cy="ticket-status"]').each(($el) => {
      expect($el.text().trim()).to.equal('DONE');
    });
  });

  it('debe restaurar todos los tickets al quitar el filtro de estado', () => {
    // Espera la carga inicial
    cy.get('[data-cy="loading-skeleton"]').should('not.exist');
    cy.get('[data-cy="ticket-card"]').should('have.length.greaterThan', 0);

    // Abre filtros avanzados y selecciona DONE
    cy.get('[data-cy="filters-toggle"]').click();
    cy.get('[data-cy="filter-status"]').click();
    cy.contains('mat-option', 'Done').click();
    cy.get('body').type('{esc}');
    cy.wait(1200);

    // Deselecciona DONE para limpiar el filtro
    cy.get('[data-cy="filter-status"]').click();
    cy.contains('mat-option', 'Done').click();
    cy.get('body').type('{esc}');
    cy.wait(1200);

    // Verifica que volvieron todos los tickets
    cy.get('[data-cy="loading-skeleton"]').should('not.exist');
    cy.get('[data-cy="ticket-card"]').should('have.length.greaterThan', 0);
  });
});
